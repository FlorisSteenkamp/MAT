"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cullTheNodes(cullNodes) {
    for (let node of cullNodes) {
        cullTheNode(node);
    }
}
exports.cullTheNodes = cullTheNodes;
function cullTheNode(cullNode) {
    let { satCircle, priorCircle } = cullNode;
    let indx = -1;
    for (let i = 0; i < priorCircle.branches.length; i++) {
        let branch = priorCircle.branches[i];
        if (branch.matCircle === satCircle) {
            indx = i;
            break;
        }
    }
    if (indx >= 0) {
        priorCircle.branches.splice(indx, 1);
    }
}
