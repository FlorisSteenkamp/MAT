"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_memoize_1 = require("flo-memoize");
const mat_1 = require("../../mat");
const svg_1 = require("../../svg/svg");
const find_and_add_3_prongs_1 = require("../find-mat/find-and-add-3-prongs");
const create_initial_cp_graph_1 = require("../find-mat/create-initial-cp-graph");
;
const add_debug_info_1 = require("../find-mat/add-debug-info");
const get_potential_2_prongs_1 = require("../find-mat/get-potential-2-prongs");
const get_interesting_points_on_loop_1 = require("../find-mat/get-interesting-points-on-loop");
const get_sharp_corners_1 = require("../find-mat/get-sharp-corners");
const orient_1 = require("../../svg/fs/simplify-paths/orient");
const get_extreme_1 = require("../../svg/fs/get-extreme");
const smoothen_1 = require("../smoothen/smoothen");
const find_and_add_2_prongs_on_all_paths_1 = require("./find-and-add-2-prongs-on-all-paths");
const find_and_add_hole_closing_2_prongs_1 = require("./find-and-add-hole-closing-2-prongs");
let { m1: memoize } = flo_memoize_1.default;
/**
 * Find the MAT from the given Shape.
 * @param shape
 */
let findMat = memoize(function (loops) {
    if (typeof _debug_ !== 'undefined') {
        let timing = _debug_.generated.timing;
        timing.simplify[0] = performance.now();
    }
    //let loops_ = loops.map(loop => Loop.perturb(loop, 10))
    //let loopss = simplifyPaths(loops_);
    let loopss = svg_1.simplifyPaths(loops);
    if (typeof _debug_ !== 'undefined') {
        let timing = _debug_.generated.timing;
        timing.simplify[1] += performance.now() - timing.simplify[0];
    }
    let mat = [];
    for (let loops of loopss) {
        loops.sort(ascendingByTopmostPoint);
        loops = orient_1.orient(loops);
        /*
        for (let loop of loops) {
            console.log(loop.toBeziers());
        }
        */
        let partialMat = findPartialMat(loops);
        if (partialMat) {
            mat.push(partialMat);
        }
    }
    return mat;
});
exports.findMat = findMat;
function findPartialMat(loops) {
    let extreme = get_extreme_1.getExtreme(loops);
    add_debug_info_1.addDebugInfo1(loops);
    // Gets interesting points on the shape, i.e. those that makes sense to use 
    // for the 2-prong procedure.
    let pointsPerLoop = loops.map(get_interesting_points_on_loop_1.getInterestingPointsOnLoop);
    let for2ProngsPerLoop = get_potential_2_prongs_1.getPotential2Prongs(pointsPerLoop);
    let sharpCornersPerLoop = get_sharp_corners_1.getSharpCorners(pointsPerLoop);
    let cpTrees = new Map();
    let cpNode = create_initial_cp_graph_1.createInitialCpGraph(loops, cpTrees, sharpCornersPerLoop);
    find_and_add_hole_closing_2_prongs_1.findAndAddHoleClosing2Prongs(loops, cpTrees, extreme);
    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterHoleClosers) {
            return undefined;
        }
    }
    add_debug_info_1.addDebugInfo2(pointsPerLoop);
    cpNode = find_and_add_2_prongs_on_all_paths_1.findAndAdd2ProngsOnAllPaths(loops, cpTrees, for2ProngsPerLoop, extreme);
    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterTwoProngs) {
            return undefined;
        }
    }
    add_debug_info_1.addDebugInfo3();
    if (cpNode === undefined) {
        return undefined;
    }
    find_and_add_3_prongs_1.findAndAddAll3Prongs(cpTrees, cpNode, extreme);
    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterThreeProngs) {
            return undefined;
        }
    }
    let mat = new mat_1.Mat(cpNode, cpTrees);
    smoothen_1.smoothen(mat.cpNode);
    add_debug_info_1.addDebugInfo4(cpNode);
    return mat;
}
/**
 *
 * @param loopA
 * @param loopB
 */
function ascendingByTopmostPoint(loopA, loopB) {
    let boundsA = svg_1.getLoopBounds(loopA);
    let boundsB = svg_1.getLoopBounds(loopB);
    let a = boundsA.minY.p[1];
    let b = boundsB.minY.p[1];
    return a - b;
}
