import { getBoundaryBeziersToNext } from "./get-boundary-beziers-to-next.js";
function cpNodesToBoundaryBeziers(cpNodes) {
    return cpNodes.flatMap(getBoundaryBeziersToNext);
}
export { cpNodesToBoundaryBeziers };
//# sourceMappingURL=cp-nodes-to-boundary-beziers.js.map