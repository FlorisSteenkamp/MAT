"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loop_1 = require("./loop");
const mat_1 = require("./mat");
const get_loop_bounds_1 = require("./svg/fs/get-loop-bounds");
const simplify_paths_1 = require("./svg/fs/simplify-paths/simplify-paths");
const get_extreme_1 = require("./svg/fs/get-extreme");
const find_and_add_3_prongs_1 = require("./mat/find-mat/find-and-add-3-prongs");
const create_initial_cp_graph_1 = require("./mat/find-mat/create-initial-cp-graph");
;
const add_debug_info_1 = require("./mat/find-mat/add-debug-info");
const get_potential_2_prongs_1 = require("./mat/find-mat/get-potential-2-prongs");
const get_sharp_corners_1 = require("./mat/find-mat/get-sharp-corners");
const smoothen_1 = require("./mat/smoothen/smoothen");
const find_and_add_2_prongs_on_all_paths_1 = require("./mat/find-mat/find-and-add-2-prongs-on-all-paths");
const create_get_interesting_points_on_loop_1 = require("./mat/find-mat/create-get-interesting-points-on-loop");
const find_and_add_hole_closing_2_prongs_1 = require("./mat/find-mat/find-and-add-hole-closing-2-prongs");
/**
 * Find the Medial Axis Transforms (MATs) from the given array of bezier loops
 * representing shape boundaries.
 * @param bezierLoops An array of (possibly intersecting) loops with each loop
 * representing one or more piecewise smooth closed curves (i.e. shapes). Each
 * loop consists of an array of beziers represented by an array of control
 * points with 2,3 or 4 elements corresponding to linear, quadratic and cubic
 * beziers respectively. Each point is a two-element array (ordered pair), the
 * first of which is the x-coordinate and the second the y-coordinate.
 * @param additionalPointCount Additional points per bezier where a MAT circle
 * will be added. Defaults to 3.
 */
function findMats(bezierLoops, additionalPointCount = 3) {
    if (typeof _debug_ !== 'undefined') {
        let timing = _debug_.generated.timing;
        timing.simplify[0] = performance.now();
    }
    //let loops_ = loops.map(loop => Loop.perturb(loop, 10))
    let loops = bezierLoops.map(beziers => loop_1.Loop.fromBeziers(beziers));
    let { loopss, xMap } = simplify_paths_1.simplifyPaths(loops);
    if (typeof _debug_ !== 'undefined') {
        let timing = _debug_.generated.timing;
        timing.simplify[1] += performance.now() - timing.simplify[0];
    }
    let mats = [];
    for (let loops of loopss) {
        loops.sort(ascendingByTopmostPoint);
        let mat = findPartialMat(loops, xMap, additionalPointCount);
        if (mat) {
            mats.push(mat);
        }
    }
    return mats;
}
exports.findMats = findMats;
/**
 *
 * @param loops
 * @param xMap
 * @param additionalPointCount
 * @private
 */
function findPartialMat(loops, xMap, additionalPointCount = 3) {
    let extreme = get_extreme_1.getExtreme(loops);
    add_debug_info_1.addDebugInfo1(loops);
    // Gets interesting points on the shape, i.e. those that makes sense to use 
    // for the 2-prong procedure.
    let f = create_get_interesting_points_on_loop_1.createGetInterestingPointsOnLoop(additionalPointCount);
    let pointsPerLoop = loops.map(f);
    let for2ProngsPerLoop = get_potential_2_prongs_1.getPotential2Prongs(pointsPerLoop);
    let sharpCornersPerLoop = get_sharp_corners_1.getSharpCorners(pointsPerLoop);
    let cpTrees = new Map();
    let cpNode = create_initial_cp_graph_1.createInitialCpGraph(loops, cpTrees, sharpCornersPerLoop, xMap);
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
    add_debug_info_1.addDebugInfo4(mat);
    return mat;
}
/**
 *
 * @param loopA
 * @param loopB
 * @private
 */
function ascendingByTopmostPoint(loopA, loopB) {
    let boundsA = get_loop_bounds_1.getLoopBounds(loopA);
    let boundsB = get_loop_bounds_1.getLoopBounds(loopB);
    let a = boundsA.minY.p[1];
    let b = boundsB.minY.p[1];
    return a - b;
}
//# sourceMappingURL=find-mats.js.map