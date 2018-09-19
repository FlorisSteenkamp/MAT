"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bezier3 = require("flo-bezier3");
const flo_memoize_1 = require("flo-memoize");
const get_loop_bounds_1 = require("./get-loop-bounds");
const point_on_shape_1 = require("../../point-on-shape");
let { m1: memoize } = flo_memoize_1.default;
/**
 * Get topmost point, bezierNode and t-value of the given loop.
 */
let getExtreme = memoize(function (loop) {
    let extremes = get_loop_bounds_1.getLoopBounds(loop);
    let curve = extremes.minY.curve;
    let ts = Bezier3.getBounds(curve.ps).ts;
    let t = ts[0][1];
    let extreme = new point_on_shape_1.PointOnShape(curve, t);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.extreme.push(extreme);
        /*
        _debug_.generated.elems.extremes.push({
            data: extreme,
            $svg: _debug_.fs.drawElem.drawExtreme(
                extreme,
                _debug_.config.toDraw.extremes[
                    _debug_.fs.elemType.extremes(extreme)
                ]
            )
        })
        */
    }
    return extreme;
});
exports.getExtreme = getExtreme;
