"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cullTheNodes(cullNodes) {
    for (let node of cullNodes) {
        cullTheNode(node);
    }
}
exports.cullTheNodes = cullTheNodes;
function cullTheNode(cullNode) {
    let { vertex, priorCircle } = cullNode;
    //let indx = -1;
    let edges = priorCircle.getEdges();
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        if (edge.toVertex === vertex) {
            //indx = i;
            break;
        }
    }
    /*
    if (indx >= 0) {
        priorCircle.edges.splice(indx, 1);
    }
    */
}
