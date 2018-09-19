"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../../mat-constants");
const flo_memoize_1 = require("flo-memoize");
const svg_1 = require("../../../svg/svg");
const point_on_shape_1 = require("../../classes/point-on-shape");
const add_2_prong_1 = require("../find-mat/add-2-prong");
const find_2_prong_1 = require("./find-2-prong/find-2-prong");
const find_and_add_3_prongs_1 = require("../find-mat/find-and-add-3-prongs");
const create_initial_cp_graph_1 = require("../find-mat/create-initial-cp-graph");
;
//import { findMat } from '../../functions/find-mat';
const add_debug_info_1 = require("../find-mat/add-debug-info");
const get_potential_2_prongs_1 = require("../find-mat/get-potential-2-prongs");
const get_interesting_points_on_loop_1 = require("../find-mat/get-interesting-points-on-loop");
const get_sharp_corners_1 = require("../find-mat/get-sharp-corners");
let { m1: memoize } = flo_memoize_1.default;
/**
 * Find the MAT from the given Shape.
 * @param shape
 */
//let findMat = memoize(function(shape: Shape) {
let findMat = memoize(function (loops) {
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.start = performance.now();
        add_debug_info_1.addDebugInfo(loops);
    }
    // Gets interesting points on the shape, i.e. those that makes 
    // sense to use for the 2-prong procedure.
    let pointsPerLoop = loops
        .map(get_interesting_points_on_loop_1.getInterestingPointsOnLoop);
    let for2ProngsPerLoop = get_potential_2_prongs_1.getPotential2Prongs(pointsPerLoop);
    let sharpCornersPerLoop = get_sharp_corners_1.getSharpCorners(pointsPerLoop);
    let cpGraphs = create_initial_cp_graph_1.createInitialCpGraph(loops, sharpCornersPerLoop);
    if (typeof _debug_ !== 'undefined') {
        add_debug_info_1.addMoreDebugInfo(pointsPerLoop);
        _debug_.generated.timing.after1Prongs = performance.now();
    }
    findAndAddHoleClosing2Prongs(loops, cpGraphs);
    findAndAdd2ProngsOnAllPaths(loops, cpGraphs, for2ProngsPerLoop);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.after2Prongs = performance.now();
    }
    let cpNode = findNth2Prong(cpGraphs.get(loops[0]), 1);
    if (cpNode === undefined) {
        return undefined;
    }
    find_and_add_3_prongs_1.findAndAdd3Prongs(cpGraphs, cpNode);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.after3Prongs = performance.now();
        _debug_.mats.push(cpNode);
    }
    return cpNode;
});
exports.findMat = findMat;
/**
 * Find the Nth available 2-prong (that is not a terminating 2-prong) on the
 * first loop of the given shape.
 */
function findNth2Prong(cpGraph, N = 1) {
    if (!cpGraph.head) {
        return undefined;
    }
    let n = 0;
    let cpNode = cpGraph.head;
    do {
        // If cpNode is part of a 2-prong and not a terminating 2-prong, we're
        // done.
        if (cpNode.getCps().length === 2 &&
            cpNode.next.prevOnCircle !== cpNode) {
            n++;
            if (n === N) {
                return cpNode;
            }
        }
        cpNode = cpNode.next;
    } while (cpNode !== cpGraph.head);
    return undefined;
}
/**
 * Add 2 prongs.
 *
 * See comments on the add2Prong function.
 */
function findAndAdd2ProngsOnAllPaths(
    //shape: Shape,
    loops, cpGraphs, for2Prongss) {
    //let for2ProngsArray = shape.for2ProngsArray;
    //for (let k=0; k<for2ProngsArray.length; k++) {
    //	let for2Prongs = for2ProngsArray[k];
    for (let k = 0; k < for2Prongss.length; k++) {
        let for2Prongs = for2Prongss[k];
        findAndAdd2Prongs(loops, cpGraphs, k, for2Prongs);
    }
}
/**
 * Finds and adds two-prongs that removes any holes in the shape.
 * @param shape
 */
function findAndAddHoleClosing2Prongs(loops, cpGraphs) {
    // Find the topmost points on each loop.
    let extremes = loops.map(svg_1.getExtreme)
        .sort(function (a, b) { return a.p[1] - b.p[1]; });
    for (let k = 1; k < extremes.length; k++) {
        let extreme = extremes[k];
        let posA2 = new point_on_shape_1.PointOnShape(extreme.bezierNode, extreme.t, mat_constants_1.MAT_CONSTANTS.pointType.extreme);
        // A normal traversal should give (cyclically) A1->A2->B1->B2
        let twoProngInfo = find_2_prong_1.find2Prong(loops, cpGraphs, posA2, true, k);
        let { circle, z: posA1 } = twoProngInfo;
        add_2_prong_1.add2Prong(
        //loops,
        cpGraphs, circle, posA2, posA1, true);
    }
}
/**
 *
 * @param shape
 * @param k
 * @param for2Prongs
 * @param ignoreNonLoops If true, ignore any MAT curves not forming part of a
 * loop.
 */
function findAndAdd2Prongs(loops, cpGraphs, k, for2Prongs) {
    let len = for2Prongs.length;
    //let index = indexInterlaced(len); // Keep for future.
    let index = indexLinear(len);
    for (let i = 0; i < len; i++) {
        let pos = for2Prongs[index[i]];
        let twoProngInfo = find_2_prong_1.find2Prong(loops, cpGraphs, pos, false, k);
        if (twoProngInfo) {
            let { circle, z } = twoProngInfo;
            add_2_prong_1.add2Prong(cpGraphs, circle, pos, z, false);
        }
        else {
            // failed
        }
    }
}
/**
 * Creates a kind of interlaced index vector, e.g. TODO
 *
 * @param n
*/
function indexInterlaced(n) {
    let source = {};
    let arr = [];
    // l <=> the lowest power of 2 so that 2^l > n
    let l = Math.pow(2, Math.floor(Math.log2(n)));
    while (l >= 1) {
        let k = 0;
        while (k < n) {
            if (!source[k]) {
                arr.push(k);
                source[k] = true;
            }
            k = k + l;
        }
        l = l / 2;
    }
    return arr;
}
/**
 * Simple linear array indexing.
 * @param n
 * @returns {number[]}
 */
function indexLinear(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(i);
    }
    return arr;
}