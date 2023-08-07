import { getShapeBounds } from '../svg/get-shape-bounds.js';
import { find2Prong } from './find-2-prong.js';
import { add2Prong } from './add-2-prong.js';
import { getCorner } from '../corner/get-corner.js';
import { rotateNeg90Degrees } from 'flo-vector2d';
const { PI, atan2 } = Math;
const ANGLE = 15 * PI / 180; // 15 degrees - don't make smaller than 2 degrees
/**
 * @internal
 * Find and add two-prongs.
 * @param loops
 * @param cpGraphs
 * @param k
 * @param for2Prongs
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd2Prongs(loops, cpGraphs, k, for2Prongs, extreme, for1Prongs) {
    let cpNode_;
    const bounds = getShapeBounds(loops);
    const squaredDiagonalLength = (bounds.maxX.p[0] - bounds.minX.p[0]) ** 2 +
        (bounds.maxY.p[1] - bounds.minY.p[1]) ** 2;
    for (let i = 0; i < for2Prongs.length; i++) {
        // const angles = [0];
        let angles = [0];
        const pos = for2Prongs[i];
        if (pos.t === 1) {
            const { curve } = pos;
            const corner = getCorner(curve.ps, curve.next.ps);
            if (corner.isQuiteDull) {
                const tangentI = rotateNeg90Degrees(corner.tangents[0]);
                const tangentO = rotateNeg90Degrees(corner.tangents[1]);
                const a1 = ((atan2(tangentI[1], tangentI[0]) + 2 * PI) % (2 * PI));
                const a2 = ((atan2(tangentO[1], tangentO[0]) + 2 * PI) % (2 * PI));
                const a3 = ((a2 - a1) + 2 * PI) % (2 * PI);
                let angle = ANGLE;
                while (angle <= a3 - (ANGLE / 2)) {
                    angles.push(angle);
                    angle += ANGLE;
                }
            }
        }
        for (let angle of angles) {
            const twoProngInfo = find2Prong(angle, loops, extreme, squaredDiagonalLength, cpGraphs, pos, false, k, for1Prongs);
            if (twoProngInfo) {
                const { circle, zs } = twoProngInfo;
                const cpNode = add2Prong(cpGraphs, circle, pos, zs, false, extreme);
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
export { findAndAdd2Prongs };
//# sourceMappingURL=find-and-add-2-prongs.js.map