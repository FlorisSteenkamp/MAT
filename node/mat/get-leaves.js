"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @hidden */
function getLeaves(cpNode) {
    let leaves = [];
    let cps = cpNode.getAllOnLoop();
    cps.forEach(function (cp) {
        if (cp.isTerminating()) {
            leaves.push(cp);
        }
    });
    return leaves;
}
exports.getLeaves = getLeaves;
//# sourceMappingURL=get-leaves.js.map