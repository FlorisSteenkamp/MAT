import { distanceBetween } from 'flo-vector2d';
import { mapDeep } from '../utils/map-deep.js';
import { removeSatInducedTrivial3Prongs } from './remove-sat-induced-trivial-3prongs.js';
import { getCpNodessForSat } from './get-cp-nodess-for-sat.js';
import { clone } from '../cp-node/fs/clone.js';
import { getBoundaryTangentLine } from '../point-on-shape/get-boundary-tangent-line.js';
import { getBeziersFromTangents } from '../utils/get-beziers-from-tangents.js';
const { max, abs, round, log2 } = Math;
// let ii = 0;
/**
 * * used for debugging only
 *
 * @param mats
 *
 * @internal
 */
function reconstructFromMats(mats, minNumAccurateBits = undefined) {
    let maxPO2 = -Infinity;
    for (const mat of mats) {
        maxPO2 = max(maxPO2, mat.meta.maxCoordPowerOf2);
    }
    const recoverBoundary_ = recoverBoundary(maxPO2, minNumAccurateBits);
    // `removeSatInducedTrivial3Prongs` relinks nodes in place so work on 
    // clones - the given `Mat`s must not be modified. (Only 
    // `meta.maxCoordPowerOf2` is used from the metas so they can be shared.)
    // Really only required if getSats was called on the `Mat`s
    const cpNodessPerSat = mats
        .map(mat => ({ cpNode: clone(mat.cpNode), meta: mat.meta }))
        .map(removeSatInducedTrivial3Prongs)
        .map(getCpNodessForSat);
    const r = mapDeep(3, cpNodessPerSat, recoverBoundary_, true);
    // ii;//?
    // Flatten the (1 or 2) beziers per boundary piece into a single array of
    // beziers per loop.
    return r.map(loops => loops.map(pieces => pieces.flat()));
}
/**
 *
 * @param cpNode
 *
 * @internal
 */
function recoverBoundary(maxPO2, minNumAccurateBits) {
    return function (cpNode) {
        const cpNode_ = cpNode.next;
        const pos = cpNode.pointOnShape;
        const pos_ = cpNode_.pointOnShape;
        const { curve, circle, p } = pos;
        const { curve: curve_, p: p_ } = pos_;
        if (p[0] === p_[0] && p[1] === p_[1]) {
            return undefined;
        }
        if (curve.loop !== curve_.loop) {
            // It is a hole-closer going over to the other loop
            // return undefined;
            return undefined;
        }
        const d = distanceBetween(circle.center, p);
        // DON'T remove these - they tell us the accuracy of the algorithm
        // if (!closeTo(2**34)(circle.radius, d) && getRealProngCount(cpNode) === 3) {
        //     ii++;
        //     circle.center;//?
        //     circle.radius;//?
        //     d;            //?
        //     p;//?
        //     pos.isSource;//?
        //     getRealProngCount(cpNode);//?
        // }
        // if (!closeTo(2**28)(circle.radius, d) && getRealProngCount(cpNode) !== 3) {
        //     ii++;
        //     circle.center;//?
        //     circle.radius;//?
        //     d;            //?
        //     p;//?
        //     pos.isSource;//?
        //     getRealProngCount(cpNode);//?
        // }
        if (minNumAccurateBits !== undefined) {
            const TOL = 2 ** (maxPO2 - minNumAccurateBits);
            if (abs(circle.radius - d) > TOL) {
                throw new Error(`Medial circle radius must be about the same (2**${round(log2(TOL))}) ` +
                    `as distance from medial circle center to point on shape, ` +
                    `found: medial radius ${circle.radius}, distance: ${d}`);
            }
        }
        return getBoundaryPiece(cpNode);
    };
}
/**
 * Returns the bezier curves (1 or 2 lines or quadratics) approximating the
 * shape boundary from the contact point of the given `CpNode` to that of the
 * next `CpNode`.
 *
 * @internal
 */
function getBoundaryPiece(cpNode) {
    return getBeziersFromTangents(getBoundaryTangentLine(cpNode.pointOnShape, true), getBoundaryTangentLine(cpNode.next.pointOnShape, false));
}
export { reconstructFromMats };
//# sourceMappingURL=reconstruct-from-mat.js.map