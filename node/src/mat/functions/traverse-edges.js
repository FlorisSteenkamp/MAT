"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Traverses all edges of a MAT starting at the given vertex.
 * @param vertex The start vertex
 * @param f A callback function for each ListNode representing the
 * start each edge.
 */
function traverseEdges(cpNode, f, inclLeaves = false) {
    let cps = cpNode.getCps();
    while (cps.length) {
        let cp = cps.pop();
        while (!cp.isTerminating()) {
            f(cp, false);
            cp = cp.next;
            if (cp.isThreeProng()) {
                cps.push(cp.nextOnCircle);
            }
        }
        if (inclLeaves) {
            f(cp, true);
        }
    }
}
exports.traverseEdges = traverseEdges;
