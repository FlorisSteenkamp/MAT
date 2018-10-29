"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../point-on-shape");
const add_to_cp_graph_1 = require("../add-to-cp-graph");
const is_another_cp_closeby_1 = require("../is-another-cp-closeby");
/**
 * Add a 1-prong to the MAT.
 * @param cpGraphs
 * @param pos
 */
function add1Prong(maxOsculatingCircleRadius, cpGraphs, pos) {
    if (point_on_shape_1.PointOnShape.isDullCorner(pos)) {
        // This is a 1-prong at a dull corner.
        // TODO IMPORTANT 
        // Remove this line, uncomment piece below it and implement the 
        // following strategy to find the 3-prongs: if deltas are conjoined due 
        // to dull corner, split the conjoinment by inserting successively 
        // closer (binary division) 2-prongs. If a 2-prong actually fails, 
        // simply remove the 1-prong at the dull corner. In this way **all** 
        // terminal points are found, e.g. zoom in on top left leg of ant.
        // Afterthought: there is a better way - split points by two prongs.
        //toRemove.push(posNode); // this!
        if (typeof _debug_ !== 'undefined') {
            _debug_.generated.elems.oneProngAtDullCorner.push(pos);
        }
        return;
    }
    let circle = point_on_shape_1.PointOnShape.getOsculatingCircle(maxOsculatingCircleRadius, pos);
    //console.log(maxOsculatingCircleRadius)
    let order = point_on_shape_1.PointOnShape.calcOrder(circle, pos);
    // Make sure there isn't already a ContactPoint close by - it can cause
    // floating point stability issues.
    if (is_another_cp_closeby_1.isAnotherCpCloseby(cpGraphs, pos, circle, order, 0, 1000, 'magenta')) {
        return;
    }
    add_to_cp_graph_1.addToCpGraph(circle, [-0.5, +0.5], cpGraphs, [pos, pos]);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.oneProng.push(pos);
    }
}
exports.add1Prong = add1Prong;
//# sourceMappingURL=add-1-prong.js.map