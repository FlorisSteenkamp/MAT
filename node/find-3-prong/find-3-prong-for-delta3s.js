import { circumCenter as getCircumCenter, fromTo, len, distanceBetween, toUnitVector, rotate90Degrees, cross } from 'flo-vector2d';
import { tangent } from 'flo-bezier3';
import { calcInitial3ProngCenter } from './calc-initial-3-prong-center.js';
import { getClosestPoints } from './get-closest-points.js';
import { calcBetterX } from './calc-better-x.js';
import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';
import { cullCurvePieces } from '../closest-boundary-point/cull-curve-pieces.js';
import { getCorner$ } from '../corner/get-corner.js';
import { isPosCorner } from '../point-on-shape/is-pos-corner.js';
import { getPosCorner$ } from '../point-on-shape/get-pos-corner.js';
import { isSharp } from '../cp-node/fs/is-sharp.js';
const { abs, asin } = Math;
/**
 * Finds a 3-prong using only the 3 given δs.
 *
 * @param δs the boundary pieces
 * @param idx δ identifier
 * @param k δs identifier
 * @param curvePiecess the curve pieces of each boundary piece
 * @param allCurvePieces all of the above flattened into one array
 * @param maxCoordPowerOf2
 *
 * @internal
 */
function find3ProngForDelta3s(δs, idx, k, curvePiecess, allCurvePieces, maxCoordPowerOf2) {
    const TOLERANCE = 2 ** (maxCoordPowerOf2 - 32);
    const MAX_ITERATIONS = 10;
    // The three boundary pieces (and their curve pieces) with the first, 
    // the `idx`th and the last taken, rotated so that the one with index `k`
    // comes first (the first one is treated specially below).
    const δs_ = [δs[0], δs[idx], δs[δs.length - 1]];
    const curvePieces_ = [curvePiecess[0], curvePiecess[idx], curvePiecess[δs.length - 1]];
    const r = (i) => (k + i) % 3;
    const δ3s = [δs_[r(0)], δs_[r(1)], δs_[r(2)]];
    const curvePiece3s = [curvePieces_[r(0)], curvePieces_[r(1)], curvePieces_[r(2)]];
    if (isSharp(δ3s[0][0])) {
        return undefined;
    }
    //----------------------------
    // const l1 = curvePiece3s[0].length;
    // const l2 = curvePiece3s[1].length;
    // const l3 = curvePiece3s[2].length;
    // if (l1 === 1 && l2 == 1 && l3 === 1) {
    //     // console.log('aaa');
    //     const A = curvePiece3s[0][0].curve.ps;
    //     const B = curvePiece3s[1][0].curve.ps;
    //     const C = curvePiece3s[2][0].curve.ps;
    //     console.log(A.length, B.length, C.length);
    // } else {
    //     // console.log('bbb');
    // }
    //----------------------------
    let poss = undefined;
    let j = 0; // Safeguard for slow convergence
    let x = calcInitial3ProngCenter(δ3s, curvePiece3s);
    if (!Number.isFinite(x[0]) || !Number.isFinite(x[1])) {
        // FUTURE - the code can be cleaned up and sped up a lot if we don't
        // use this function as is but instead use δs[0] and δs[2] as is
        // and make δs[1] include all the rest of the beziers around the 
        // loop. This check, for instance, would be eliminated completely.
        return undefined;
    }
    // the closest points on the three boundary pieces to the current center
    poss = getClosestPoints(x, curvePiece3s);
    let tolerance = Infinity;
    while (tolerance > TOLERANCE && j < MAX_ITERATIONS) {
        j++;
        const circumCenter = getCircumCenter(poss.map(x => x.p));
        const vectorToZeroV = fromTo(x, circumCenter);
        if (!Number.isFinite(vectorToZeroV[0]) || !Number.isFinite(vectorToZeroV[1])) {
            // FUTURE - the code can be cleaned up and sped up a lot if we don't
            // use this function as is but instead use δs[0] and δs[2] as is
            // and make δs[1] include all the rest of the beziers around the 
            // loop. This check, for instance, would be eliminated completely.
            return undefined;
        }
        const upds = calcBetterX(curvePiece3s, x, vectorToZeroV);
        x = upds.newX;
        // `calcBetterX` already found the closest points at the new center -
        // use them for the next iteration instead of searching again
        poss = upds.newPoss;
        const V = len(vectorToZeroV); // The 'potential'
        tolerance = abs(V - upds.newV);
    }
    const radius = (distanceBetween(x, poss[0].p) +
        distanceBetween(x, poss[1].p) +
        distanceBetween(x, poss[2].p)) / 3;
    const circle = { center: x, radius };
    //-------------------------------------------------------------------------
    // Calculate the unit tangent vector at 3-prong circle points - they should 
    // be very close to tangent to the boundary piece tangents at those points 
    // (up to sign). Dull corners is a common special case.
    //-------------------------------------------------------------------------
    let totalAngleError = 0;
    for (let i = 0; i < 3; i++) {
        const pos = poss[i];
        //----------------------------
        // Tangent of circle at point
        //----------------------------
        const v = toUnitVector(fromTo(pos.p, x));
        const v1 = rotate90Degrees(v);
        //-----------------------------------
        // Check if point is on dull crorner
        //-----------------------------------
        if (isPosCorner(pos) && getPosCorner$(pos).isDull) {
            const corner = getCorner$(pos.curve.ps, pos.curve.next.ps);
            const tans = corner.tangents;
            const perps = tans.map(rotate90Degrees);
            const angleError1 = asin(cross(perps[0], v));
            const angleError2 = asin(cross(v, perps[1]));
            let angleError = 0;
            if (angleError1 > 0) {
                angleError += angleError1;
            }
            if (angleError2 > 0) {
                angleError += angleError2;
            }
            totalAngleError += angleError;
        }
        else {
            //---------------------------
            // Tangent of curve at point
            //---------------------------
            const v2 = toUnitVector(tangent(pos.curve.ps, pos.t));
            // Cross is more numerically stable than Vector.dot at angles a
            // multiple of π **and** is close to the actual angle value
            // and can thus just be added to cone method of looking at 
            // tolerance.
            // Should be close to zero and is close to the actual angle.
            const cross_ = abs(asin(cross(v1, v2)));
            totalAngleError += cross_;
        }
    }
    //-------------------------------------------------------------------------
    // Calculate radiusDelta, the difference between the radius and the closest
    // point to the 3-prong. It should be around 0. If not, this is not a good 
    // candidate for the 3-prong.
    //-------------------------------------------------------------------------
    // Only boundary pieces that come within the radius of the center can be
    // closer than the three touching pieces, so cull against the radius first
    // (cheap, memoized bounding box tests) and run the (expensive) certified
    // closest point search once on the survivors only. The touching pieces 
    // always survive (their distance is about the radius) so the result is
    // the true closest distance over all the boundary pieces.
    const nearCurvePieces = cullCurvePieces(allCurvePieces, x, (1 + 2 ** -20) * radius * radius);
    const closestPos = getCloseBoundaryPointsCertified(nearCurvePieces, x)[0];
    const closestD = closestPos === undefined ? radius : distanceBetween(closestPos.p, x);
    const radiusDelta = abs(radius - closestD);
    // Weights below still need to be optimized.
    const W1 = 1;
    const W2 = 1;
    const error = W1 * radiusDelta + W2 * totalAngleError;
    return { threeProngInfo: { poss, circle, δ3s }, error };
}
export { find3ProngForDelta3s };
//# sourceMappingURL=find-3-prong-for-delta3s.js.map