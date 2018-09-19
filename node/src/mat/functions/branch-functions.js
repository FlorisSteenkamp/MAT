"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Marks the given branch as already taken.
 */
function markBranchAsTaken(visitedNodeMap, matCircle1, matCircle2) {
    f(matCircle1, matCircle2);
    f(matCircle2, matCircle1);
    function f(matCircle1, matCircle2) {
        let visitedNodes = visitedNodeMap.get(matCircle1);
        if (!visitedNodes) {
            visitedNodes = new Set();
            visitedNodeMap.set(matCircle1, visitedNodes);
        }
        visitedNodes.add(matCircle2);
    }
}
exports.markBranchAsTaken = markBranchAsTaken;
function hasBranchBeenTaken(branchMap, matCircle1, matCircle2) {
    let nodes;
    nodes = branchMap.get(matCircle1);
    let takenForward = nodes && nodes.has(matCircle2);
    nodes = branchMap.get(matCircle2);
    let takenBackwards = nodes && nodes.has(matCircle1);
    return takenForward || takenBackwards;
}
exports.hasBranchBeenTaken = hasBranchBeenTaken;
