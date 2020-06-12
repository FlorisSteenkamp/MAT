"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaves = void 0;
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