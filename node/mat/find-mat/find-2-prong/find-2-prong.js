import { distanceBetween, squaredDistanceBetween, interpolate } from 'flo-vector2d';
import { getClosestBoundaryPoint } from '../../closest-boundary-point/get-closest-boundary-point.js';
import { getOsculatingCircle } from '../../../point-on-shape/get-osculating-circle.js';
import { add1Prong } from '../add-1-prong.js';
import { addDebugInfo } from './add-debug-info.js';
import { cullBezierPieces } from './cull-bezier-pieces.js';
import { findEquidistantPointOnLine } from './find-equidistant-point-on-line.js';
import { getInitialBezierPieces } from './get-initial-bezier-pieces.js';
import { getCloseBoundaryPoints } from '../../closest-boundary-point/get-close-boundary-points.js';
import { reduceRadius } from './reduce-radius.js';
const { sqrt, abs } = Math;
/**
 * @internal
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
    const squaredSeperationTolerance = (1e-7 * extreme) ** 2;
    // TODO - base deltas on theory or remove
    // const oneProngTolerance = (1e-7*extreme)**2;
    // const squaredErrorTolerance = 1e-4 * squaredSeperationTolerance;
    const squaredErrorTolerance = (1e-8 * extreme) ** 2;
    // const squaredErrorTolerance = (1e-6*extreme)**2;
    const maxOsculatingCircleRadiusSquared = squaredDiagonalLength;
    // The boundary piece that should contain the other point of 
    // the 2-prong circle. (Defined by start and end points).
    const { bezierPieces, δ } = getInitialBezierPieces(isHoleClosing, k, loops, cpTrees, y);
    //console.log(bezierPieces.length)
    /** The center of the two-prong (successively refined) */
    let x;
    let p;
    let r;
    if (isHoleClosing) {
        p = [y.p[0], y.p[1]];
        x = [p[0], p[1] - sqrt(maxOsculatingCircleRadiusSquared)];
        r = maxOsculatingCircleRadiusSquared;
    }
    else {
        p = y.p;
        x = getOsculatingCircle(maxOsculatingCircleRadiusSquared, y).center;
        r = squaredDistanceBetween(p, x);
    }
    // The lines below is an optimization.
    const r_ = reduceRadius(extreme, bezierPieces, p, x);
    if (r > r_) {
        x = interpolate(p, x, sqrt(r_ / r));
    }
    /** Trace the convergence (for debugging). */
    const xs = [];
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
        const xy = squaredDistanceBetween(x, y.p);
        bezierPieces_ = cullBezierPieces(bezierPieces_, x, xy);
        z = getClosestBoundaryPoint(bezierPieces_, x, y.curve, y.t);
        if (z === undefined) {
            if (typeof _debug_ !== 'undefined') {
                const elems = _debug_.generated.elems;
                const elem = isHoleClosing
                    ? elems.twoProng_holeClosing
                    : elems.twoProng_regular;
                const elemStr = isHoleClosing
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
        const xz = squaredDistanceBetween(x, z.pos.p);
        const yz = squaredDistanceBetween(y.p, z.pos.p);
        // TODO - squaredSeperationTolerance should in future be replaced with
        // a relative error, i.e. distance between y (or z) / length(y (or z)).
        if (!isHoleClosing) {
            if (yz <= squaredSeperationTolerance) {
                if (typeof _debug_ !== 'undefined') {
                    // console.log('failed: seperation too small');
                }
                failed = true;
                break;
            }
            if (i === 1) {
                if (xy < xz * (1 - 2 ** -12)) {
                    // It is a 1-prong.
                    add1Prong(sqrt(maxOsculatingCircleRadiusSquared), cpTrees, y);
                    return undefined;
                }
                //if (xy < xz*(1 + 2**-20)) {
                //	// if it's too close to call rather not add the 2-prong either
                //	if (typeof _debug_ !== 'undefined') {
                //		console.log('failed: too close to call');
                //	}
                //	failed = true;
                //	break;
                //}
            }
        }
        // TODO - Accuracy optimization: tolerance should not be between x and 
        // nextX, but rather (distance from x to y) - (distance from x to z)
        // Find the point on the line connecting y with x that is  
        // equidistant from y and z. This will be our next x.
        // const nextX = findEquidistantPointOnLineDd(x, y.p, z.pos.p);
        const nextX = findEquidistantPointOnLine(x, y.p, z.pos.p);
        // const squaredError = squaredDistanceBetween(x, nextX);
        const squaredError = (sqrt(xy) - sqrt(xz)) ** 2;
        x = nextX;
        if (squaredError < squaredErrorTolerance) {
            done++; // Do one more iteration
        }
        else if (i === MAX_ITERATIONS) {
            // Convergence was too slow.
            if (typeof _debug_ !== 'undefined') {
                console.log('failed: max iterations reached');
            }
            failed = true;
            break; // We're done
        }
    } while (done < 1);
    /************************************************************************ */
    /* Do one more double-double precision iteration
    /************************************************************************ */
    /*
    z = getClosestBoundaryPoint(
        bezierPieces_, x, y.curve, y.t
    );

    if (z === undefined) {
        failed = true;
    }
    
    if (typeof _debug_ !== 'undefined') {
        xs.push({ x, y, z: z.pos, t: y.t });
    }
    
    if (!isHoleClosing && squaredDistanceBetween(y.p, z.pos.p) <= squaredSeperationTolerance) {
        failed = true;
    } else {
        x = findEquidistantPointOnLineDd(x, y.p, z.pos.p);
    }
    /************************************************************************ */
    /************************************************************************ */
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
    // TODO2
    // if (Math.random() > 0.8 && !isHoleClosing) { return undefined; }
    if (typeof _debug_ !== 'undefined' && !failed) {
        xs.push({ x, y, z: z.pos, t: y.t });
        addDebugInfo(bezierPieces, failed, y, circle, z.pos, δ, xs, isHoleClosing);
    }
    return failed ? undefined : { circle: circle, zs };
}
export { find2Prong };
//# sourceMappingURL=find-2-prong.js.map