"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_memoize_1 = require("flo-memoize");
const flo_bezier3_1 = require("flo-bezier3");
const point_on_shape_1 = require("../../point-on-shape");
let { m1: memoize } = flo_memoize_1.default;
const INF = Number.POSITIVE_INFINITY;
let getLoopBounds = memoize(function (loop) {
    let extremes = [
        [
            { bezier: undefined, t: undefined, val: INF },
            { bezier: undefined, t: undefined, val: INF }
        ],
        [
            { bezier: undefined, t: undefined, val: -INF },
            { bezier: undefined, t: undefined, val: -INF }
        ]
    ];
    loop.curves.forEach(function (curve) {
        let ps = curve.ps;
        let bounds = flo_bezier3_1.getBounds(ps);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                let v = bounds.box[i][j];
                let m = i === 0 ? -1 : 1; // min or max?
                let x = extremes[i][j].val;
                if (m * v > m * x || (v === x && bounds.ts[i][j] > extremes[i][j].t)) {
                    extremes[i][j] = {
                        bezier: curve,
                        t: bounds.ts[i][j],
                        val: v
                    };
                }
            }
        }
    });
    return {
        minX: new point_on_shape_1.PointOnShape(extremes[0][0].bezier, extremes[0][0].t),
        minY: new point_on_shape_1.PointOnShape(extremes[0][1].bezier, extremes[0][1].t),
        maxX: new point_on_shape_1.PointOnShape(extremes[1][0].bezier, extremes[1][0].t),
        maxY: new point_on_shape_1.PointOnShape(extremes[1][1].bezier, extremes[1][1].t)
    };
});
exports.getLoopBounds = getLoopBounds;
