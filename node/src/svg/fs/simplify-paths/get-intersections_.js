"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const flo_lines_intersections_1 = require("flo-lines-intersections");
const point_on_shape_1 = require("../../../point-on-shape");
const pair_set_1 = require("./pair-set");
// TODO - DELTA is arbitrary
const DELTA = 1e-6;
/**
 * Find and return all intersections on all given loops.
 * @param loops
 */
function getIntersections(loops) {
    let { ls, lineInfoMap } = getLineInfos(loops);
    let lineIntersections = getLineIntersections(ls, lineInfoMap);
    // Check curve intersection amongst possibilities
    /** A map from bezier nodes to all its intersecting beziers */
    let intersections = new Map();
    let checkedPairs = new Map();
    for (let i = 0; i < lineIntersections.length; i++) {
        let lineIntersection = lineIntersections[i];
        //_debug_.fs.draw.crossHair(lineIntersection.p, 'nofill thin1 blue', 1);	
        //console.log(lineIntersection.p)
        let curves = [
            lineInfoMap.get(lineIntersection.l1).curve,
            lineInfoMap.get(lineIntersection.l2).curve,
        ];
        if (pair_set_1.pairSet_has(checkedPairs, curves)) {
            continue;
        }
        pair_set_1.pairSet_add(checkedPairs, curves);
        let pss = curves.map(curve => curve.ps);
        let tPairs = flo_bezier3_1.bezier3Intersection(pss[0], pss[1]);
        /*
        console.log('-------');
        console.log(tPairs.toString());
        console.log(pss[0].toString());
        console.log(pss[1].toString());
        console.log('-------');
        */
        for (let tPair of tPairs) {
            // TODO - the below check is temporary - there is a better way
            // TODO - eliminate the fact that intersections are found twice
            if ((Math.abs(tPair[0]) < DELTA && Math.abs(tPair[1] - 1) < DELTA) ||
                (Math.abs(tPair[1]) < DELTA && Math.abs(tPair[0] - 1) < DELTA)) {
                continue;
            }
            /*
            if (_debug_ !== 'undefined') {
                let p = evaluate(pss[0], tPair[0]);
                _debug_.fs.draw.crossHair(p, 'nofill thin1 red', 2);
            }
            */
            let xInfos = [];
            xInfos.push({
                loop: curves[0].loop,
                pos: new point_on_shape_1.PointOnShape(curves[0], tPair[0]),
                opposite: undefined,
                loopTree: undefined,
            });
            xInfos.push({
                loop: curves[1].loop,
                pos: new point_on_shape_1.PointOnShape(curves[1], tPair[1]),
                opposite: xInfos[0],
                loopTree: undefined,
            });
            xInfos[0].opposite = xInfos[1];
            for (let j = 0; j < 2; j++) {
                let intersectingCurves = intersections.get(curves[j]);
                if (!intersectingCurves) {
                    intersectingCurves = [];
                    intersections.set(curves[j], intersectingCurves);
                }
                intersectingCurves.push(xInfos[j]);
            }
        }
    }
    return intersections;
}
exports.getIntersections = getIntersections;
/**
 * Returns an array of lines of the bounding hulls of the Loop beziers' control
 * points including a map that maps each line to its hull, path and curve.
 * @param loops An array of Loops
 */
function getLineInfos(loops) {
    /** Map that maps a line segment to some info. */
    let lineInfoMap = new Map();
    let ls = [];
    // Get lines making up the hulls of the paths
    for (let loop of loops) {
        loop.curves.forEach(function (curve) {
            let hull = flo_bezier3_1.getBoundingHull(curve.ps);
            // Map each line in the hull to the hull and add the line to an 
            // array.
            for (let i = 0; i < hull.length; i++) {
                let l;
                if (i === hull.length - 1) {
                    l = [hull[hull.length - 1], hull[0]];
                }
                else {
                    l = [hull[i], hull[i + 1]];
                }
                ls.push(l);
                lineInfoMap.set(l, { hull, loop, curve });
            }
        });
    }
    return { ls, lineInfoMap };
}
function getLineIntersections(ls, lineInfoMap) {
    // Get possible intersections between curves
    let lineIntersections = flo_lines_intersections_1.default(ls, function (l1, l2) {
        // Same hull? Then don't check for intersection.
        let sameHull = lineInfoMap.get(l1).hull === lineInfoMap.get(l2).hull;
        if (sameHull) {
            return true;
        }
        // Endpoints coincide? Then don't check for intersection
        let [p1, p2] = l1;
        let [p3, p4] = l2;
        if ((p1[0] === p3[0] && p1[1] === p3[1]) || (p2[0] === p3[0] && p2[1] === p3[1]) ||
            (p1[0] === p4[0] && p1[1] === p4[1]) || (p2[0] === p4[0] && p2[1] === p4[1])) {
            return true;
        }
        return false;
    });
    return lineIntersections;
}
