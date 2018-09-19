"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const point_on_shape_1 = require("../classes/point-on-shape");
const vertex_1 = require("../classes/vertex/vertex");
/**
 * Add a 1-prong to the MAT.
 * @param shape
 * @param pos
 */
function add1Prong(cpGraphs, pos) {
    if (pos.type === mat_constants_1.MAT_CONSTANTS.pointType.dull) {
        // This is a 1-prong at a dull corner.
        // TODO IMPORTANT 
        // Remove this line, uncomment piece below it and implement the 
        // following strategy to find the 3-prongs: if deltas are conjoined due 
        // to dull corner, split the conjoinment by inserting successively 
        // closer (binary division) 2-prongs. If a 2-prong actually fails, 
        // simply remove the 1-prong at the dull corner. In this way **all** 
        // terminal points are found, e.g. zoom in on top left leg of ant.
        // There is a better way though - split points by two prongs.
        //toRemove.push(posNode); // this!
        if (typeof _debug_ !== 'undefined') {
            recordForDebugging_dull(pos);
        }
        return;
    }
    let circle = point_on_shape_1.PointOnShape.getOsculatingCircle(pos);
    //let pos1 = pos.clone();
    //pos1.order = -0.5;
    //let pos2 = pos.clone();
    //pos2.order = +0.5;
    vertex_1.Vertex.create2(circle, [-0.5, +0.5], cpGraphs, [pos, pos]);
    if (typeof _debug_ !== 'undefined') {
        recordForDebugging(pos);
    }
}
exports.add1Prong = add1Prong;
function recordForDebugging_dull(pos) {
    let oCircle = point_on_shape_1.PointOnShape.getOsculatingCircle(pos);
    // TODO - why would it be NaN in some cases?
    if (Number.isNaN(oCircle.center[0])) {
        return;
    }
    _debug_.generated.elems.oneProngsAtDullCorner.push({
        data: { pos },
        $svg: _debug_.fs.drawElem.draw1ProngAtDullCorner(pos, 
        //_debug_.is.oneProngsAtDullCorner.all({pos}) &&
        _debug_.config.toDraw.oneProngsAtDullCorner &&
            _debug_.config.toDraw.oneProngsAtDullCorner[_debug_.fs.elemType.oneProngsAtDullCorner({ pos })]
        //_debug_.isVisible.oneProngsAtDullCorner.all({pos})
        //_debug_.config.toDraw.oneProngsAtDullCorner.all
        )
    });
}
function recordForDebugging(pos) {
    _debug_.generated.elems.oneProngs.push({
        data: { pos },
        $svg: _debug_.fs.drawElem.draw1Prong(pos, _debug_.config.toDraw.oneProngs &&
            _debug_.config.toDraw.oneProngs[_debug_.fs.elemType.oneProngs({ pos })])
    });
}
