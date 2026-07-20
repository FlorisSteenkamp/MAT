import { getMatCurveToNext } from '../cp-node/fs/get-mat-curve-to-next.js';
import { splitTriPath } from './split-tri-path.js';
import { getBoundary } from './get-boundary.js';
import { isOnSameLoop } from '../cp-node/fs/is-on-same-loop.js';
/**
 * Returns a correspondence between boundary bezier curves and a medial axis
 * bezier curve. They will later be interpolated.
 *
 * @param cpNode the start `CpNode`
 */
function getMatchingBeziers(cpNode) {
    const medialBezier = {
        ps: getMatCurveToNext(cpNode),
        ts: [0, 1]
    };
    if (cpNode.isHoleClosing && // short-circuit
        !isOnSameLoop(cpNode, cpNode.next)) {
        // We get here for half of hole-closers, as only half of hole-closers are on a different loop.
        // This cpNode indicates we should connect the hole
        // console.log('hole-closing dummy case');
        return undefined;
    }
    const r = getBoundary(cpNode);
    const { boundaryBeziers, boundaryBeziersOpp } = r;
    const matchedBezierss = splitTriPath(boundaryBeziers, medialBezier, boundaryBeziersOpp ?? []);
    return matchedBezierss;
}
export { getMatchingBeziers };
//# sourceMappingURL=get-matching-beziers.js.map