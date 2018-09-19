"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const flo_lines_intersections_1 = require("flo-lines-intersections");
const point_on_shape_1 = require("../../../point-on-shape");
const DELTA = 10e-6;
function getPathsIntersections(paths) {
    let { ls, lineInfoMap } = getLineInfos(paths);
    let lineIntersections = getLineIntersections(ls, lineInfoMap);
    // Check curve intersection amongst possibilities
    /** A map from bezier nodes to all its intersecting beziers */
    let intersections = new Map();
    let checkedPairs = new Set(); // Duplicate prevention
    for (let i = 0; i < lineIntersections.length; i++) {
        let lineIntersection = lineIntersections[i];
        let lineInfos = [
            lineInfoMap.get(lineIntersection.l1),
            lineInfoMap.get(lineIntersection.l2),
        ];
        let curves = lineInfos.map(info => info.curve);
        let idxs = curves.map(curve => curve.idx);
        // TODO - improve
        let key = idxs[0] < idxs[1] ? '' + idxs[0] + '_' + idxs[1] : '' + idxs[1] + '_' + idxs[0];
        if (checkedPairs.has(key)) {
            continue;
        }
        checkedPairs.add(key);
        let pss = curves.map(curve => curve.ps);
        let tPairs = flo_bezier3_1.bezier3Intersection(pss[0], pss[1]);
        for (let tPair of tPairs) {
            // TODO - the below check is temporary - there should be a better way
            // TODO - also eliminate the fact that intersections are found twice
            if ((Math.abs(tPair[0]) < DELTA && Math.abs(tPair[1] - 1) < DELTA) ||
                (Math.abs(tPair[1]) < DELTA && Math.abs(tPair[0] - 1) < DELTA)) {
                continue;
            }
            if (_debug_ !== undefined) {
                let p = flo_bezier3_1.evaluate(pss[0], tPair[0]);
                _debug_.fs.draw.crossHair(p, 'nofill thin20 red', 1);
            }
            let xInfos = [];
            xInfos.push({
                path: curves[0].loop,
                pos: new point_on_shape_1.PointOnShape(curves[0], tPair[0]),
                opposite: undefined,
                loop: undefined,
            });
            xInfos.push({
                path: curves[1].loop,
                pos: new point_on_shape_1.PointOnShape(curves[1], tPair[1]),
                opposite: xInfos[0],
                loop: undefined,
            });
            xInfos[0].opposite = xInfos[1];
            for (let i = 0; i < 2; i++) {
                let intersectingCurves = intersections.get(curves[i]);
                if (!intersectingCurves) {
                    intersectingCurves = [];
                    intersections.set(curves[i], intersectingCurves);
                }
                intersectingCurves.push(xInfos[i]);
            }
        }
    }
    return intersections;
}
exports.getPathsIntersections = getPathsIntersections;
/**
 * Returns an array of lines that is the lines of the bounding hulls of the Loop
 * including a map that maps each line to its hull, path and curve.
 * @param paths An array of Loops
 */
function getLineInfos(paths) {
    /** Map that maps a line segment to some info. */
    let lineInfoMap = new Map();
    let ls = [];
    // Get lines making up the hulls of the paths
    for (let path of paths) {
        console.log(path);
        path.curves.forEach(function (curve) {
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
                lineInfoMap.set(l, { hull, path, curve });
            }
        });
    }
    return { ls, lineInfoMap };
}
function getLineIntersections(ls, lineInfoMap) {
    // Get possible intersections between curves
    let lineIntersections = flo_lines_intersections_1.default(ls, function (l1, l2) {
        // Same hull? Then don't check for intersection
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
