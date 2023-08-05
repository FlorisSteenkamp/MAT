/** @internal */
declare const _debug_: Debug;

import { LlRbTree } from 'flo-ll-rb-tree';
import { Debug } from '../debug/debug.js';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { getShapeBounds } from '../svg/get-shape-bounds.js';
import { find2Prong } from './find-2-prong.js';
import { add2Prong } from './add-2-prong.js';
import { isPosDullCorner } from '../point-on-shape/is-pos-dull-corner.js';
import { getCornerAtEnd } from '../curve/curve.js';
import { getCorner } from '../corner/get-corner.js';
import { rotate90Degrees, rotateNeg90Degrees } from 'flo-vector2d';


const { PI, atan2 } = Math;
const ANGLE = 15*PI/180;  // 15 degrees - don't make smaller than 2 degrees


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
function findAndAdd2Prongs(
        loops: Loop[],
        cpGraphs: Map<Loop,LlRbTree<CpNode>>,
        k: number, 
        for2Prongs: PointOnShape[],
        extreme: number) {

    let cpNode_;

    const bounds = getShapeBounds(loops);
    const squaredDiagonalLength = 
        (bounds.maxX.p[0] - bounds.minX.p[0])**2 +
        (bounds.maxY.p[1] - bounds.minY.p[1])**2;

    for (let i=0; i<for2Prongs.length; i++) {
        // const angles = [0];
        let angles = [0];
        const pos = for2Prongs[i];
        if (pos.t === 1) {
            const { curve } = pos;
            const corner = getCorner(curve.ps, curve.next.ps);
            if (corner.isQuiteDull) {
                const tangentI = rotateNeg90Degrees(corner.tangents[0]);
                const tangentO = rotateNeg90Degrees(corner.tangents[1]);
                const a1 = ((atan2(tangentI[1], tangentI[0]) + 2*PI)%(2*PI));
                const a2 = ((atan2(tangentO[1], tangentO[0]) + 2*PI)%(2*PI));
                const a3 = ((a2 - a1) + 2*PI)%(2*PI);
                let angle = ANGLE;
                while (angle <= a3 - (ANGLE/2)) {
                    // angles.push(angle);
                    angle += ANGLE;
                }
            }
        }
        for (let angle of angles) {
            const twoProngInfo = find2Prong(
                angle, loops, extreme, squaredDiagonalLength, cpGraphs, pos, false, k
            );

            if (twoProngInfo) {
                const { circle, zs } = twoProngInfo;
                const cpNode = add2Prong(cpGraphs, circle, pos, zs, false, extreme);
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
