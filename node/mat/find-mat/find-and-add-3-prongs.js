"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAndAddAll3Prongs = void 0;
const point_on_shape_1 = require("../../point-on-shape");
const find_3_prong_1 = require("./find-3-prong/find-3-prong");
const add_3_prong_1 = require("../find-mat/add-3-prong");
/**
 * @hidden
 * Finds and adds all 3-prongs.
 * @param cpGraphs
 * @param cpStart The CpNode to start traversing from.
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAddAll3Prongs(cpGraphs, cpStart, extreme) {
    // Don't change this function to be recursive, the call stack may overflow 
    // if there are too many two-prongs.
    let visitedEdges = new Map();
    let edgesToCheck = [{ fromCpNode: undefined, cpStart }];
    while (edgesToCheck.length) {
        let { fromCpNode, cpStart } = edgesToCheck.shift();
        markEdgeAsTaken(visitedEdges, fromCpNode, cpStart);
        for (let cpNode of cpStart.getCpNodesOnCircle()) {
            //if (!PointOnShape.isSharpCorner(cpNode.cp.pointOnShape)) {
            if (!point_on_shape_1.isPosSharpCorner(cpNode.cp.pointOnShape)) {
                if (findAndAdd3Prongs(cpGraphs, cpNode, extreme) === undefined) {
                    return; // only for debugging purposes
                }
                ;
            }
            if (hasEdgeBeenTaken(visitedEdges, cpNode, cpNode.next)) {
                continue; // We already visited this edge
            }
            edgesToCheck.push({ fromCpNode: cpStart, cpStart: cpNode.next });
        }
    }
}
exports.findAndAddAll3Prongs = findAndAddAll3Prongs;
/**
 * @hidden
 * Marks the given edge as already taken.
 */
function markEdgeAsTaken(visitedEdges, cp1, cp2) {
    if (cp1 === undefined) {
        return;
    }
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
/** @hidden */
function hasEdgeBeenTaken(visitedEdges, cp1, cp2) {
    let cps;
    cps = visitedEdges.get(cp1);
    let takenForward = cps && cps.has(cp2);
    cps = visitedEdges.get(cp2);
    let takenBackwards = cps && cps.has(cp1);
    return takenForward || takenBackwards;
}
/**
 * @hidden
 * Traverses the shape from the given ContactPoint going around contact circles
 * so that only a piece of the shape is traversed and returns the visited
 * CpNodes (starting from the given CpNode).
 * @param cpStart The ContactPoint from where to start the traversal.
 */
function traverseShape(cpStart) {
    let cpNode = cpStart;
    if (cpNode === cpNode.next.prevOnCircle) {
        return [cpNode];
    }
    let visitedCps = [];
    do {
        visitedCps.push(cpNode);
        let next = cpNode.next.prevOnCircle;
        cpNode = cpNode === next
            ? cpNode = cpNode.next.next // Terminal vertex
            : cpNode = next; // Take last exit
    } while (cpNode !== cpStart);
    return visitedCps;
}
/**
 * @hidden
 * Starting from some ContactPoint, traverses the shape going around Vertices
 * and if more than two Vertices have been visited in total then recursively
 * adds 3-prongs until only one or two Vertices have been visited.
 *
 * This process further subdivides the shape.
 * @param cpGraphs
 * @param cpStart The ContactPoint from where to start the process.
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
let ii = 0;
function findAndAdd3Prongs(cpGraphs, cpStart, extreme) {
    let visitedCps;
    do {
        visitedCps = traverseShape(cpStart);
        if (visitedCps.length > 2) {
            findAndAdd3Prong(cpGraphs, visitedCps, extreme);
            ii++;
        }
        if (typeof _debug_ !== 'undefined') {
            if (ii === _debug_.directives.stopAfterThreeProngsNum) {
                return undefined;
            }
        }
    } while (visitedCps.length > 2);
    return visitedCps;
}
/**
 * @hidden
 * Finds and add a 3-prong MAT circle to the given shape.
 * @param cpGraphs
 * @param visitedCps
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd3Prong(cpGraphs, visitedCps, extreme) {
    let δs = [];
    for (let visitedCp of visitedCps) {
        δs.push([visitedCp, visitedCp.next]);
    }
    let threeProng = find_3_prong_1.find3Prong(δs, extreme);
    let orders = [];
    for (let i = 0; i < 3; i++) {
        orders.push(
        //PointOnShape.calcOrder(threeProng.circle, threeProng.ps[i])
        point_on_shape_1.calcPosOrder(threeProng.circle, threeProng.ps[i]));
    }
    let circle = add_3_prong_1.add3Prong(cpGraphs, orders, threeProng);
    if (typeof _debug_ !== 'undefined') {
        add3ProngDebugInfo(circle, visitedCps);
    }
}
/** @hidden */
function add3ProngDebugInfo(circle, visitedCps) {
    let threeProngs = _debug_.generated.elems.threeProng;
    let len = threeProngs.length;
    let data = threeProngs[len - 1];
    data.visitedCps = visitedCps;
    data.circle = circle;
}
//# sourceMappingURL=find-and-add-3-prongs.js.map