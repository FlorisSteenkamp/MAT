/** @internal */
declare const _debug_: Debug;

import { Debug } from '../debug/debug.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { find2Prong } from './find-2-prong.js';
import { add2Prong } from './add-2-prong.js';
import { rotateNeg90Degrees } from 'flo-vector2d';
import { MatMeta } from '../mat/mat-meta.js';
import { getCorner } from '../corner/get-corner.js';


const { PI, atan2 } = Math;
// const ANGLE = 15*PI/180;  // 15 degrees - don't make smaller than 2 degrees


/**
 * @internal
 * Find and add two-prongs.
 * @param meta 
 * @param angleIncrement 
 * @param for2Prongs 
 * @param for1Prong
 */
function findAndAdd2Prongs(
        meta: MatMeta,
        angleIncrement: number,
        for2Prongs: PointOnShape[],
        for1Prong: boolean) {

    let cpNode_;

    const angleIncrement_ = angleIncrement*PI/180;
    for (let i=0; i<for2Prongs.length; i++) {
        const angles = [0];
        const pos = for2Prongs[i];
        if (pos.t === 1) {
            const { curve } = pos;
            const corner = getCorner(curve.ps, curve.next.ps);
            if (corner.isQuiteDull) {
                const tangentI = rotateNeg90Degrees(corner.tangents[0]);
                const tangentO = rotateNeg90Degrees(corner.tangents[1]);
                // const tangentI = corner.tangents[0];
                // const tangentO = corner.tangents[1];
                const a1 = (atan2(tangentI[1], tangentI[0]) + 2*PI)%(2*PI);
                const a2 = (atan2(tangentO[1], tangentO[0]) + 2*PI)%(2*PI);
                const a3 = ((a2 - a1) + 2*PI)%(2*PI);
                let angle = angleIncrement_;
                while (angle <= a3 - (angleIncrement_/2)) {
                    angles.push(angle);
                    angle += angleIncrement_;
                }
            }
        }
        for (let angle of angles) {
            const twoProngInfo = find2Prong(
                meta, false, for1Prong, angle, pos
            );
            if (twoProngInfo) {
                const { circle, zs } = twoProngInfo;
                const cpNode = add2Prong(meta, circle, [pos, ...zs], false);
                cpNode_ = cpNode_ || cpNode;
            }

            if (typeof _debug_ !== 'undefined') {
                if (i + 1 === _debug_.directives.stopAfterTwoProngsNum) { return undefined; }
            }
        }
    }

    return cpNode_;
}


export { findAndAdd2Prongs }
