import { getBoundaryBezierPartsToNext } from '../cp-node/fs/get-boundary-bezier-parts-to-next.js';
import { filterZeroLength } from "./filter-zero-length.js";
import { isFullyTerminating } from './is-fully-terminating.js';
function getBoundary(cpNode) {
    const cpNodeOpp = isFullyTerminating(cpNode)
        ? undefined // no opposite boundary
        : cpNode.next.prevOnCircle;
    const boundaryBeziers = filterZeroLength(getBoundaryBezierPartsToNext(cpNode));
    const boundaryBeziersOpp = cpNodeOpp === undefined
        ? undefined
        : filterZeroLength(getBoundaryBezierPartsToNext(cpNodeOpp));
    return {
        boundaryBeziers,
        boundaryBeziersOpp
    };
}
export { getBoundary };
//# sourceMappingURL=get-boundary.js.map