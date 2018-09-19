"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../classes/point-on-shape");
const find_3_prong_1 = require("../functions/find-3-prong/find-3-prong");
const add_3_prong_1 = require("../functions/add-3-prong");
const edge_functions_1 = require("../functions/edge-functions");
/**
 * Recursively builds the MAT tree.
 * The returned Vertex === the Vertex of the cpStart parameter.
 * @param cpStart The ContactPoint to start traversing from.
 */
function buildMat(cpGraphs, cpStart) {
    /*
    traverseEdges(cpStart.item.vertex, function(cp) {
        if (cp.item.pointOnShape.type !== 1) {
            findAndAdd3Prongs(shape, cp);
        }
    });
    
    return cpStart.item.vertex;
    */
    let visitedEdges = new Map();
    return f(cpStart);
    function f(cpStart, fromNode) {
        if (fromNode) {
            edge_functions_1.markEdgeAsTaken(visitedEdges, fromNode, cpStart.item.vertex);
        }
        let vertex = cpStart.item.vertex;
        for (let cp of vertex.cps) {
            if (cp.item.pointOnShape.type !== 1) {
                findAndAdd3Prongs(cpGraphs, cp);
            }
            if (edge_functions_1.hasEdgeBeenTaken(visitedEdges, cp.item.vertex, cp.next.item.vertex)) {
                continue; // We already visited this edge
            }
            f(cp.next, vertex);
        }
        return vertex;
    }
}
exports.buildMat = buildMat;
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
function findAndAdd3Prongs(cpGraphs, cpStart) {
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
    let vertex = add_3_prong_1.add3Prong(cpGraphs, orders, threeProng);
    if (typeof _debug_ !== 'undefined') {
        add3ProngDebugInfo(vertex, visitedCps);
    }
}
function add3ProngDebugInfo(vertex, visitedCps) {
    let threeProngs = _debug_.generated.elems.threeProngs;
    let len = threeProngs.length;
    let data = threeProngs[len - 1].data;
    data.visitedCps = visitedCps;
    data.vertex = vertex;
}
