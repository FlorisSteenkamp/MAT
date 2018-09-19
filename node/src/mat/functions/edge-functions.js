"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Marks the given edge as already taken.
 */
function markEdgeAsTaken(visitedEdges, cp1, cp2) {
    f(cp1, cp2);
    f(cp2, cp1);
    function f(cp1, cp2) {
        let visited = visitedEdges.get(cp1);
        if (!visited) {
            visited = new Set();
            visitedEdges.set(cp1, visited);
        }
        visited.add(cp2);
    }
}
exports.markEdgeAsTaken = markEdgeAsTaken;
function hasEdgeBeenTaken(visitedEdges, cp1, cp2) {
    let cps;
    cps = visitedEdges.get(cp1);
    let takenForward = cps && cps.has(cp2);
    cps = visitedEdges.get(cp2);
    let takenBackwards = cps && cps.has(cp1);
    return takenForward || takenBackwards;
}
exports.hasEdgeBeenTaken = hasEdgeBeenTaken;
