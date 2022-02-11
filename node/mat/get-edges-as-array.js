import { traverseEdges } from '../traverse-edges.js';
/** @hidden */
function getEdgesAsArray(cpNode) {
    let cpNodes = [];
    traverseEdges(cpNode, function (cpNode) { cpNodes.push(cpNode); });
    return cpNodes;
}
export { getEdgesAsArray };
//# sourceMappingURL=get-edges-as-array.js.map