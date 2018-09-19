"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svg_1 = require("../../../svg/svg");
const create_initial_cp_graph_1 = require("./create-initial-cp-graph");
const find_mat_1 = require("../../functions/find-mat");
const add_debug_info_1 = require("./add-debug-info");
const get_potential_2_prongs_1 = require("./get-potential-2-prongs");
const get_interesting_points_on_loop_1 = require("./get-interesting-points-on-loop");
const get_sharp_corners_1 = require("./get-sharp-corners");
/**
 * A Shape represents the loops of individual cubic bezier curves composing
 * an SVG element. When constructed, some initial analysis is done.
 */
class Shape {
    get mat() { return find_mat_1.findMat(this); }
    /**
     * @param bezierArrays - An array (loop) of cubic bezier arrays. Each loop
     * represents a closed path of the shape.
     */
    constructor(bezierLoops) {
        if (typeof _debug_ !== 'undefined') {
            _debug_.generated.timing.start = performance.now();
        }
        this.bezierLoops = bezierLoops;
        if (typeof _debug_ !== 'undefined') {
            add_debug_info_1.addDebugInfo(bezierLoops);
        }
        this.extremes = bezierLoops.map(svg_1.getExtreme);
        // This is to find the topmost points on each loop.
        this.extremes.sort(function (a, b) { return a.p[1] - b.p[1]; });
        //this.shapeBounds = getLoopBounds(bezierLoops[0]);
        // Gets interesting points on the shape, i.e. those that makes 
        // sense to use for the 2-prong procedure.
        let pointOnShapeArrPerLoop = bezierLoops
            .map(get_interesting_points_on_loop_1.getInterestingPointsOnLoop);
        let for2ProngsArray = get_potential_2_prongs_1.getPotential2Prongs(pointOnShapeArrPerLoop);
        let sharpCornersPerLoop = get_sharp_corners_1.getSharpCorners(pointOnShapeArrPerLoop);
        this.for2ProngsArray = for2ProngsArray;
        this.cpGraphs = create_initial_cp_graph_1.createInitialCpGraph(this, sharpCornersPerLoop);
        if (typeof _debug_ !== 'undefined') {
            add_debug_info_1.addMoreDebugInfo(pointOnShapeArrPerLoop);
            _debug_.generated.timing.after1Prongs = performance.now();
        }
    }
}
exports.Shape = Shape;
