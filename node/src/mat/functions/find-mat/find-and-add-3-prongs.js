"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../classes/point-on-shape");
const find_3_prong_1 = require("./find-3-prong/find-3-prong");
const add_3_prong_1 = require("../../functions/find-mat/add-3-prong");
const edge_functions_1 = require("../edge-functions");
/**
 * Finds and adds all 3-prongs.
 * @param cpStart The CpNode to start traversing from.
 */
function findAndAdd3Prongs(cpGraphs, cpStart) {
    let visitedEdges = new Map();
    f(cpStart);
    function f(cpStart, fromCpNode) {
        if (fromCpNode) {
            edge_functions_1.markEdgeAsTaken(visitedEdges, fromCpNode, cpStart);
        }
        for (let cpNode of cpStart.getCps()) {
            if (cpNode.cp.pointOnShape.type !== 1) {
                findAndAdd3Prongs_(cpGraphs, cpNode);
            }
            if (edge_functions_1.hasEdgeBeenTaken(visitedEdges, cpNode, cpNode.next)) {
                continue; // We already visited this edge
            }
            f(cpNode.next, cpStart);
        }
    }
}
exports.findAndAdd3Prongs = findAndAdd3Prongs;
/**
 * Traverses the shape from the given ContactPoint going around Vertices so
 * that only a piece of the shape is traversed and returns the visited
 * ContactPoints (starting from the given ContactPoint).
 * @param cpStart The ContactPoint from where to start the traversal.
 */
function traverseShape(cpStart) {
    let cp = cpStart;
    if (cp === cp.next.prevOnCircle) {
        return [cp];
    }
    let visitedCps = [];
    do {
        visitedCps.push(cp);
        let next = cp.next.prevOnCircle;
        cp = cp === next
            ? cp = cp.next.next // Terminal vertex
            : cp = next; // Take last exit
    } while (cp !== cpStart);
    return visitedCps;
}
/**
 * Starting from some ContactPoint, traverses the shape going around Vertices
 * and if more than two Vertices have been visited in total then recursively
 * adds 3-prongs until only one or two Vertices have been visited.
 *
 * This process further subdivides the shape.
 * @param shape
 * @param cpStart The ContactPoint from where to start the process.
 */
function findAndAdd3Prongs_(cpGraphs, cpStart) {
    let visitedCps;
    do {
        visitedCps = traverseShape(cpStart);
        if (visitedCps.length > 2) {
            findAndAdd3Prong(cpGraphs, visitedCps);
        }
    } while (visitedCps.length > 2);
    return visitedCps;
}
/**
 * Finds and add a 3-prong MAT circle to the given shape. Modifies shape.
 *
 * @param shape
 * @param visitedCps
 */
function findAndAdd3Prong(cpGraphs, visitedCps) {
    let deltas = [];
    for (let visitedCp of visitedCps) {
        deltas.push([visitedCp, visitedCp.next]);
    }
    let threeProng = find_3_prong_1.find3Prong(deltas);
    let orders = [];
    for (let i = 0; i < 3; i++) {
        orders.push(point_on_shape_1.PointOnShape.calcOrder(threeProng.circle, threeProng.ps[i]));
    }
    let circle = add_3_prong_1.add3Prong(cpGraphs, orders, threeProng);
    if (typeof _debug_ !== 'undefined') {
        add3ProngDebugInfo(circle, visitedCps);
    }
}
function add3ProngDebugInfo(circle, visitedCps) {
    let threeProngs = _debug_.generated.elems.threeProngs;
    let len = threeProngs.length;
    let data = threeProngs[len - 1].data;
    data.visitedCps = visitedCps;
    data.circle = circle;
}
