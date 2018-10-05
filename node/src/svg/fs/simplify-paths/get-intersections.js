"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const x_1 = require("../../../x");
const point_on_shape_1 = require("../../../point-on-shape");
const pair_set_1 = require("./pair-set");
const find_bb_intersections_1 = require("../../../bounding-box/find-bb-intersections");
// TODO - DELTA is somewhat arbitrary
const DELTA = 1e-10;
/**
 * Find and return all intersections on all given loops.
 * @param loops
 */
function getIntersections(loops) {
    // intersection <=> X
    let { boxes, boxInfoMap } = getBoxInfos(loops);
    let boxIntersections = find_bb_intersections_1.default(boxes);
    // Check curve intersection amongst possibilities
    /** A map from each curve to its intersectings */
    let xMap = new Map();
    let checkedPairs = new Map();
    for (let i = 0; i < boxIntersections.length; i++) {
        let { box1, box2 } = boxIntersections[i];
        let curves = [
            boxInfoMap.get(box1).curve,
            boxInfoMap.get(box2).curve,
        ];
        if (pair_set_1.pairSet_has(checkedPairs, curves)) {
            continue;
        }
        pair_set_1.pairSet_add(checkedPairs, curves);
        let pss = curves.map(curve => curve.ps);
        let tPairs = flo_bezier3_1.bezier3Intersection(pss[0], pss[1]);
        if (!tPairs.length) {
            continue;
        }
        for (let tPair of tPairs) {
            let curves_ = confirmIntersection(checkedPairs, curves, tPair);
            if (curves_ === undefined) {
                continue;
            }
            let xs = [];
            for (let j of [0, 1]) {
                let curve = curves_[j];
                let x = new x_1.X(new point_on_shape_1.PointOnShape(curve, tPair[j]));
                // Get intersections stored at this curve
                let curveXs = xMap.get(curve) || [];
                if (!curveXs.length) {
                    xMap.set(curve, curveXs);
                }
                // Add an intersection to this curve
                curveXs.push(x);
                xs.push(x);
            }
            xs[0].opposite = xs[1];
            xs[1].opposite = xs[0];
        }
    }
    return xMap;
}
exports.getIntersections = getIntersections;
/**
 *
 */
function confirmIntersection(checkedPairs, curves, tPair) {
    let curves_ = curves.slice();
    // TODO - the below check is temporary - there is a better way
    // TODO - eliminate the fact that intersections are found twice
    if (((Math.abs(tPair[0]) < DELTA && Math.abs(tPair[1] - 1) < DELTA) ||
        (Math.abs(tPair[0] - 1) < DELTA && Math.abs(tPair[1]) < DELTA) ||
        (Math.abs(tPair[0]) < DELTA && Math.abs(tPair[1]) < DELTA) ||
        (Math.abs(tPair[0] - 1) < DELTA && Math.abs(tPair[1] - 1) < DELTA)) &&
        (curves_[0].next === curves_[1] || curves_[1].next === curves_[0])) {
        return undefined;
    }
    if (Math.abs(tPair[0] - 1) < DELTA) {
        // If the intersection occurs at the end, move it to the start
        // so we don't have a very small bezier piece left.
        curves_[0] = curves_[0].next;
        tPair[0] = 0;
        // Recheck
        if (pair_set_1.pairSet_has(checkedPairs, [curves_[0], curves_[1]])) {
            return undefined;
        }
    }
    if (Math.abs(tPair[1] - 1) < DELTA) {
        // If the intersection occurs at the end, move it to the start
        // so we don't have a very small bezier piece left.
        curves_[1] = curves_[1].next;
        tPair[1] = 0;
        // Recheck
        if (pair_set_1.pairSet_has(checkedPairs, [curves_[0], curves_[1]])) {
            return undefined;
        }
    }
    return curves_;
}
/**
 * Returns an array of lines of the bounding hulls of the Loop beziers' control
 * points including a map that maps each line to its hull, path and curve.
 * @param loops An array of Loops
 */
function getBoxInfos(loops) {
    /** Map that maps a line segment to some info. */
    let boxInfoMap = new Map();
    let boxes = [];
    // Get lines making up the hulls of the paths
    for (let loop of loops) {
        loop.curves.forEach(function (curve) {
            let box = flo_bezier3_1.getBoundingBox(curve.ps);
            boxes.push(box);
            boxInfoMap.set(box, { box, loop, curve });
        });
    }
    return { boxes, boxInfoMap };
}
