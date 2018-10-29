"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLeaves(cpNode) {
    let leaves = [];
    let cps = cpNode.getAllOnLoop();
    cps.forEach(function (cp) {
        if (cp.isTerminating()) {
            leaves.push(cp);
        }
    });
    /*
    traverseEdges(cpNode, f, true);

    function f(cp: CpNode, isLeaf: boolean) {
        if (isLeaf) {
            leaves.push(cp);
        }
    }
    */
    return leaves;
}
exports.getLeaves = getLeaves;
//# sourceMappingURL=get-leaves.js.map