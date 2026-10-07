import type { BezierPiece } from 'flo-bezier3';
import type { Mat } from '../mat/mat.js';
import type { CpNode } from '../cp-node/cp-node.js';
import { distanceBetween } from 'flo-vector2d';
import { mapDeep } from '../utils/map-deep.js';
import { removeSatInducedTrivial3Prongs } from './remove-sat-induced-trivial-3prongs.js';
import { getCpNodessForSat } from './get-cp-nodess-for-sat.js';
import { getRealProngCount } from '../cp-node/fs/get-real-prong-count.js';
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
function reconstructFromMats(
        mats: Mat[],
        minNumAccurateBits: number | undefined = undefined) {

    const maxPO2 = max(...mats.map(mat => mat.meta.maxCoordPowerOf2));
    const recoverBoundary_ = recoverBoundary(maxPO2, minNumAccurateBits);

    // Really only required if getSats was called on the `Mat`s
    const cpNodessPerSat = mats
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
function recoverBoundary(
        maxPO2: number,
        minNumAccurateBits: number | undefined) {

    return function (cpNode: CpNode) {
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
        
        if (getRealProngCount(cpNode)) {

        }

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
            const TOL = 2**(maxPO2 - minNumAccurateBits);

            if (abs(circle.radius - d) > TOL) {
                throw new Error(
                    `Medial circle radius must be about the same (2**${round(log2(TOL))}) ` +
                    `as distance from medial circle center to point on shape, ` + 
                    `found: medial radius ${circle.radius}, distance: ${d}`
                );
            }
        }

        return getBoundaryPiece(cpNode);
    }
}


/**
 * Returns the bezier curves (1 or 2 lines or quadratics) approximating the 
 * shape boundary from the contact point of the given `CpNode` to that of the 
 * next `CpNode`.
 * 
 * @internal
 */
function getBoundaryPiece(
        cpNode: CpNode) {

    return getBeziersFromTangents(
        getBoundaryTangentLine(cpNode.pointOnShape, true),
        getBoundaryTangentLine(cpNode.next.pointOnShape, false)
    );
}


export { reconstructFromMats }
