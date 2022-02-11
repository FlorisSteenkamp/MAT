import { lineLineIntersection, distanceBetween, squaredDistanceBetween, interpolate, dot } from 'flo-vector2d';
import { evalDeCasteljau as evalDeCasteljau_ } from 'flo-bezier3';
import { getClosestBoundaryPoint } from '../../closest-boundary-point/get-closest-boundary-point.js';
import { getOsculatingCircle } from '../../../point-on-shape.js';
import { add1Prong } from '../add-1-prong.js';
import { addDebugInfo } from './add-debug-info.js';
import { cullBezierPieces } from './cull-bezier-pieces.js';
import { findEquidistantPointOnLine } from './find-equidistant-point-on-line.js';
import { getInitialBezierPieces } from './get-initial-bezier-pieces.js';
import { getCloseBoundaryPoints } from '../../closest-boundary-point/get-close-boundary-points.js';
const evalDeCasteljau = evalDeCasteljau_;
/**
 * @hidden
 * Adds a 2-prong to the MAT. The first point on the shape boundary is given and
 * the second one is found by the algorithm.
 *
 * A 2-prong is defined as a MAT circle that touches the shape at exactly 2
 * points.
 *
 * Before any 2-prongs are added the entire shape is our δΩ (1-prongs do not
 * reduce the boundary).
 *
 * As per the paper by Choi, Choi, Moon and Wee:
 *   "The starting point of this algorithm is a choice of a circle Br(x)
 *    centered at an interior point x which contains two boundary portions c and
 *    d of dΩ as in Fig. 19."
 * In fact, we (and they) start by fixing one point on the boundary beforehand.
 * @param loops A shape represented by path loops
 * @param extreme The extreme coordinate value of the shape
 * @param squaredDiagonalLength The squared diagonal length of the shape
 * bounding box.
 * @param y The source point of the 2-prong to be found
 * @param isHoleClosing True if this is a hole-closing two-prong, false otherwise
 * @param k The loop array index
 */
function find2Prong(loops, extreme, squaredDiagonalLength, cpTrees, y, isHoleClosing, k) {
    const MAX_ITERATIONS = 25;
    const squaredSeperationTolerance = (1e-6 * extreme) ** 2;
    // TODO - base deltas on theory or remove
    const oneProngTolerance = (1e-4) ** 2;
    const squaredErrorTolerance = 1e-2 * squaredSeperationTolerance;
    const maxOsculatingCircleRadiusSquared = squaredDiagonalLength;
    // The boundary piece that should contain the other point of 
    // the 2-prong circle. (Defined by start and end points).
    let { bezierPieces, δ } = getInitialBezierPieces(isHoleClosing, k, loops, cpTrees, y);
    //console.log(bezierPieces.length)
    /** The center of the two-prong (successively refined) */
    let x;
    let p;
    let r;
    if (isHoleClosing) {
        p = [y.p[0], y.p[1]];
        x = [p[0], p[1] - Math.sqrt(maxOsculatingCircleRadiusSquared)];
        r = maxOsculatingCircleRadiusSquared;
    }
    else {
        p = y.p;
        //x = PointOnShape.getOsculatingCircle(maxOsculatingCircleRadiusSquared, y).center;
        x = getOsculatingCircle(maxOsculatingCircleRadiusSquared, y).center;
        r = squaredDistanceBetween(p, x);
    }
    // The lines below is an optimization.
    let r_ = reduceRadius(extreme, bezierPieces, p, x);
    if (r > r_) {
        x = interpolate(p, x, Math.sqrt(r_ / r));
    }
    /** Trace the convergence (for debugging). */
    let xs = [];
    /** The antipode of the two-prong (successively refined) */
    let z;
    let i = 0;
    let done = 0;
    let failed = false; // The failed flag is set if a 2-prong cannot be found.
    let bezierPieces_ = bezierPieces;
    // ---> for (let b of bezierPieces) { d.fs.draw.bezierPiece(document.getElementsByTagName('g')[0], b.curve.ps, b.ts, 'nofill thin10 red', 100); }
    do {
        i++;
        /** squared distance between source boundary point and circle center */
        let r = squaredDistanceBetween(x, y.p);
        bezierPieces_ = cullBezierPieces(bezierPieces_, x, r);
        z = getClosestBoundaryPoint(bezierPieces_, x, y.curve, y.t);
        if (z === undefined) {
            if (typeof _debug_ !== 'undefined') {
                let elems = _debug_.generated.elems;
                let elem = isHoleClosing
                    ? elems.twoProng_holeClosing
                    : elems.twoProng_regular;
                let elemStr = isHoleClosing
                    ? 'hole-closing: ' + elem.length
                    : 'regular: ' + elem.length;
                console.log('failed: no closest point - ' + elemStr);
            }
            failed = true;
            break;
        }
        if (typeof _debug_ !== 'undefined') {
            xs.push({ x, y, z: z.pos, t: y.t });
        }
        /** squared distance between anti-pode boundary point and circle center */
        let d = squaredDistanceBetween(x, z.pos.p);
        //if (i === 1 && d*oneProngTolerance >= r) {
        if (i === 1 && r < d + oneProngTolerance) {
            // It is a 1-prong.
            add1Prong(Math.sqrt(maxOsculatingCircleRadiusSquared), cpTrees, y);
            return undefined;
        }
        // TODO - squaredSeperationTolerance should in future be replaced with
        // a relative error, i.e. distance between y (or z) / length(y (or z)).
        if (!isHoleClosing && squaredDistanceBetween(y.p, z.pos.p) <= squaredSeperationTolerance) {
            if (typeof _debug_ !== 'undefined') {
                /*
                let elems = _debug_.generated.elems;
                let elem = isHoleClosing
                    ? elems.twoProng_holeClosing
                    : elems.twoProng_regular
                let elemStr = isHoleClosing
                    ? 'hole-closing: ' + elem.length
                    : 'regular: ' + elem.length;
                console.log(
                    'failed: two-prong radius too small - ' + elemStr
                );
                */
            }
            failed = true;
            break;
        }
        // TODO - Accuracy optimization: tolerance should not be between x and 
        // nextX, but rather (distance from x to y) - (distance from x to z)
        // Find the point on the line connecting y with x that is  
        // equidistant from y and z. This will be our next x.
        let nextX = findEquidistantPointOnLine(x, y.p, z.pos.p);
        let squaredError = squaredDistanceBetween(x, nextX);
        x = nextX;
        if (squaredError < squaredErrorTolerance) {
            done++; // Do one more iteration
        }
        else if (i === MAX_ITERATIONS) {
            // Convergence was too slow.
            failed = true;
            break; // We're done
        }
    } while (done < 1);
    // TODO - Optimization: only do this if second closest point is within the
    // tolerance which can be checked in getClosestBoundaryPoint algorithm
    let zs = [];
    if (!failed) {
        zs = getCloseBoundaryPoints(bezierPieces_, x, y, distanceBetween(x, z.pos.p));
        if (!zs.length) {
            // TODO - Numerical issue - fix
            zs.push(z);
        }
    }
    let circle;
    if (z !== undefined) {
        circle = { center: x, radius: distanceBetween(x, z.pos.p) };
    }
    if (typeof _debug_ !== 'undefined' && !failed) {
        xs.push({ x, y, z: z.pos, t: y.t });
        addDebugInfo(bezierPieces, failed, y, circle, z.pos, δ, xs, isHoleClosing);
    }
    return failed ? undefined : { circle, zs };
}
/**
 * @hidden
 * Reduces the circle radius initially as an optimization step.
 */
function reduceRadius(extreme, bezierPieces, p, x) {
    const TOLERANCE = extreme * 1e-3;
    let prevP = undefined;
    let minRadius = Number.POSITIVE_INFINITY;
    for (let i = 0; i < bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];
        let ps = bezierPiece.curve.ps;
        let p1 = evalDeCasteljau(ps, bezierPiece.ts[0]);
        let r1 = Number.POSITIVE_INFINITY;
        // Prevent evaluating the same points twice
        if (!prevP || prevP[0] !== p1[0] || prevP[1] !== p1[1]) {
            let cc1 = getCircleCenterFrom2PointsAndNormal(extreme, p, x, p1);
            if (cc1) {
                r1 = squaredDistanceBetween(p, cc1);
            }
        }
        let r2 = Number.POSITIVE_INFINITY;
        let p2 = evalDeCasteljau(ps, bezierPiece.ts[1]);
        let cc2 = getCircleCenterFrom2PointsAndNormal(extreme, p, x, p2);
        if (cc2) {
            r2 = squaredDistanceBetween(p, cc2);
        }
        prevP = p2;
        let d = Math.min(r1, r2);
        if (d < minRadius) {
            minRadius = d;
        }
    }
    // The extra bit is to account for floating point precision.
    // TODO - base delta on theory
    return minRadius + TOLERANCE;
}
/**
 * @hidden
 * @param p A point on the circle with normal pointing to x towards the center
 * of the circle.
 * @param x
 * @param p1 Another point on the circle.
 */
function getCircleCenterFrom2PointsAndNormal(extreme, p, x, p1) {
    // TODO - remove delta
    let TOLERANCE = (1e-4 * extreme) ** 2;
    // Ignore if p and p1 are too close together
    if (squaredDistanceBetween(p, p1) < TOLERANCE) {
        return undefined;
    }
    /** The perpindicular bisector between the two given points on the circle */
    let pb = [
        (p[0] + p1[0]) / 2,
        (p[1] + p1[1]) / 2,
    ];
    let tan = [p1[0] - p[0], p1[1] - p[1]];
    let norm = [-tan[1], tan[0]]; // Rotate by 90 degrees
    let pb2 = [pb[0] + norm[0], pb[1] + norm[1]];
    let res = lineLineIntersection([p, x], [pb, pb2]);
    if (!res) {
        return undefined;
    }
    let resO = [res[0] - p[0], res[1] - p[1]];
    let xO = [x[0] - p[0], x[1] - p[1]];
    if (dot(resO, xO) < 0) {
        return undefined;
    }
    return res;
}
export { find2Prong };
//# sourceMappingURL=find-2-prong.js.map