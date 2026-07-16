import { find2Prong } from './find-2-prong.js';
import { add2Prong } from './add-2-prong.js';
import { rotateNeg90Degrees } from 'flo-vector2d';
import { getCorner } from '../corner/get-corner.js';
const { PI, atan2 } = Math;
// const ANGLE = 15*PI/180;  // 15 degrees - don't make smaller than 2 degrees
/**
 * Find and add two-prongs.
 * @param meta
 * @param angleIncrement
 * @param for2Prongs
 * @param for1Prong
 *
 * @internal
 */
function findAndAdd2Prongs(meta, angleIncrement, for2Prongs, for1Prong) {
    let cpNode_;
    const find2Prong_ = find2Prong(meta);
    const angleIncrement_ = angleIncrement * PI / 180;
    for (let i = 0; i < for2Prongs.length; i++) {
        const pos = for2Prongs[i];
        const angles = getValidAngles(angleIncrement_, pos);
        for (const angle of angles) {
            const twoProngInfo = find2Prong_(false, for1Prong, angle, pos);
            if (twoProngInfo) {
                const { circle, z } = twoProngInfo;
                const cpNode = add2Prong(meta, circle, pos, z, false);
                cpNode_ = cpNode_ || cpNode;
            }
            if (typeof _debug_ !== 'undefined') {
                if (i + 1 === _debug_.directives.stopAfterTwoProngsNum) {
                    return undefined;
                }
            }
        }
    }
    return cpNode_;
}
function getValidAngles(angleIncrement_, ppos) {
    const angles = [0];
    if (ppos.t === 1) {
        const { curve } = ppos;
        const corner = getCorner(curve.ps, curve.next.ps);
        if (corner.isQuiteDull) {
            const tangentI = rotateNeg90Degrees(corner.tangents[0]);
            const tangentO = rotateNeg90Degrees(corner.tangents[1]);
            const a1 = (atan2(tangentI[1], tangentI[0]) + 2 * PI) % (2 * PI);
            const a2 = (atan2(tangentO[1], tangentO[0]) + 2 * PI) % (2 * PI);
            const a3 = ((a2 - a1) + 2 * PI) % (2 * PI);
            let angle = angleIncrement_;
            while (angle <= a3 - (angleIncrement_ / 2)) {
                angles.push(angle);
                angle += angleIncrement_;
            }
        }
    }
    return angles;
}
export { findAndAdd2Prongs };
//# sourceMappingURL=find-and-add-2-prongs.js.map