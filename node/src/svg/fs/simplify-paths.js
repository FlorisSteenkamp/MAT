"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bezier3 = require("flo-bezier3");
const Vector = require("flo-vector2d");
const loop_1 = require("../../linked-list/loop");
const is_path_positively_oriented_1 = require("../fs/is-path-positively-oriented");
const get_loop_bounds_1 = require("../fs/get-loop-bounds");
const get_paths_intersections_1 = require("./simplify-paths/get-paths-intersections");
/**
 * Uses the algorithm of Lavanya Subramaniam (PARTITION OF A NON-SIMPLE POLYGON
 * INTO SIMPLE POLYGONS) but modified to use cubic bezier curves (as opposed to
 * polygons) and to additionally take care of paths with multiple subpaths, i.e.
 * such as disjoint nested paths.
 * @param paths An array of paths
 */
function simplifyPaths(paths) {
    //console.log(getPathStrFromBeziers(paths[0].items, 4));
    let intersections = get_paths_intersections_1.getPathsIntersections(paths);
    let path = paths[0];
    let orientation = is_path_positively_oriented_1.isPathPositivelyOrientated(path) ? +1 : -1;
    //console.log(orientation);
    let extremes = get_loop_bounds_1.getLoopBounds(path);
    // Main algorithm start
    let xStack = [];
    let minXBez = extremes.minX.bezier;
    let tMinX = extremes.minX.t;
    // Get current bezier and t value
    let dummyLoop = {
        beziers: [],
        loopSet: undefined,
        orientation: orientation === +1 ? -1 : +1,
        windingNum: 0
    };
    xStack.push({
        bezier: minXBez,
        t: tMinX,
        opposite: undefined,
        loop: dummyLoop,
        loopSet: undefined
    });
    xStack[0].opposite = xStack[0];
    /** An array of an array of loops */
    let loopSets = [];
    let takenXs = new Set(); // Taken intersections
    // Each loop in loopStack will give rise to one componentLoop
    let loopSet = [];
    while (xStack.length) {
        let xInfo = xStack.pop();
        if (takenXs.has(xInfo)) {
            continue;
        }
        let curBez = xInfo.opposite.bezier;
        let curT = xInfo.opposite.t;
        let endBez = xInfo.bezier;
        let endT = xInfo.t;
        let oldLoop = xInfo.opposite.loop;
        let oldOrientation = oldLoop.orientation;
        let oldWindingNum = oldLoop.windingNum;
        let iInfo = getIntersectionInfo(xInfo, oldOrientation, oldWindingNum);
        let newOrientation = iInfo.newOrientation;
        let newWindingNum = iInfo.newWindingNum;
        let beziers = [];
        let thisLoop = {
            beziers,
            loopSet: undefined,
            orientation: newOrientation,
            windingNum: newWindingNum
        };
        let loopSet;
        if ((oldWindingNum === +1 && newWindingNum === -1) ||
            (oldWindingNum === -1 && newWindingNum === +1) ||
            (oldWindingNum === 0)) {
            // We're starting a new loop set
            loopSet = { loops: [] };
            loopSets.push(loopSet);
        }
        else {
            loopSet = xInfo.opposite.loopSet;
        }
        loopSet.loops.push(thisLoop);
        thisLoop.loopSet = loopSet;
        if (curT === 1) {
            curBez = curBez.next;
            curT = 0;
        }
        let done = false;
        // Make a complete loop thus finding one componentLoop
        while (!done) {
            //---- Get next intersection on current bezier
            let XInfos = intersections.get(curBez) || [];
            let XIdx = undefined;
            let bestT = Number.POSITIVE_INFINITY;
            for (let i = 0; i < XInfos.length; i++) {
                let XInfo = XInfos[i];
                let t = XInfo.t;
                // For the final bezier, don't go beyond end point
                let maxT = 1;
                if (curBez === endBez && curT < endT) {
                    maxT = endT;
                }
                let deltaT = t - curT;
                if (deltaT > 0 && deltaT < bestT && t < maxT) {
                    XIdx = i;
                    bestT = deltaT;
                }
            }
            //---- Add a bezier to component loop
            if (XIdx !== undefined) {
                // We are at an intersection
                let XInfo = XInfos[XIdx];
                let endT = XInfo.t;
                beziers.push(Bezier3.fromTo(curBez.item)(curT, endT));
                if (!takenXs.has(XInfo.opposite)) {
                    xStack.push(XInfo.opposite);
                    XInfo.loop = thisLoop;
                    XInfo.loopSet = thisLoop.loopSet;
                }
                takenXs.add(XInfo); // Mark this intersection as taken once
                // Move onto next bezier
                curBez = XInfo.opposite.bezier; // Switch to other path's bezier
                curT = XInfo.opposite.t; // ...
            }
            else {
                // For the final bezier, don't go beyond end point
                let maxT = 1;
                if (curBez === endBez && curT < endT) {
                    maxT = endT;
                    done = true;
                }
                beziers.push(Bezier3.fromTo(curBez.item)(curT, maxT));
                // Move onto next bezier
                curBez = curBez.next; // Stay on current path
                curT = 0; // ...
            }
        }
    }
    let simplePathss = loopSets.map(function (loopSet) {
        return loopSet.loops
            .filter(loop => Math.abs(loop.windingNum) <= 1)
            .map((loop, k) => new loop_1.Loop(loop.beziers, k));
    });
    //console.log(getPathStrFromBeziers(simplePathss[1][0].items, 4));
    return simplePathss;
}
exports.simplifyPaths = simplifyPaths;
/**
 *
 * @param xInfo The intersection
 * @param oldOrientation
 * @param oldWindingNum
 */
function getIntersectionInfo(xInfo, oldOrientation, oldWindingNum) {
    // Left or right turning? - The current X
    let oldInBez = xInfo.opposite.bezier.item;
    let oldInT = xInfo.opposite.t;
    let oldOutBez = xInfo.bezier.item;
    let oldOutT = xInfo.t;
    if (oldInBez === oldOutBez) {
        // This is the first loop's start - it's a special case
        let newOrientation = oldOrientation === +1 ? -1 : +1;
        return { newOrientation, newWindingNum: newOrientation };
    }
    let tanIn = Bezier3.tangent(oldInBez, oldInT);
    let tanOut = Bezier3.tangent(oldOutBez, oldOutT);
    /*
    _debug_.fs.draw.bezier(oldInBez);
    _debug_.fs.draw.crossHair(Bezier3.evaluate(oldInBez,oldInT), 'nofill thin20 blue', 1);
    _debug_.fs.draw.bezier(oldOutBez, 'green thin5 nofill');
    */
    /*
     let uIn  = Vector.scale(Vector.toUnitVector(tanIn ), 10);
     let uOut = Vector.scale(Vector.toUnitVector(tanOut), 10);
     let pIn  = Bezier3.evaluate(oldInBez, oldInT);
     let pOut = Bezier3.evaluate(oldOutBez, oldOutT);
     let l1 = [pIn, Vector.translate(pIn, uIn)];
     let l2 = [pOut, Vector.translate(pOut, uOut)];
     _debug_.fs.draw.line(l1);
     _debug_.fs.draw.line(l2, 'green thin5 nofill');
     */
    //_debug_.fs.draw.bezier(oldInBez);
    // TODO - if cross product is close to 0 check second 
    // derivatives (the same can be done at cusps in the mat code).
    // E.g. a figure eight with coinciding bezier stretches can
    // cause stability issues.
    let c = Vector.cross(tanIn, tanOut);
    let isLeft = c > 0;
    //let isRight = !isLeft;
    let isTwist = (isLeft && oldOrientation === +1) ||
        (!isLeft && oldOrientation === -1);
    let windingNumberInc = isTwist
        ? -2 * oldOrientation
        : oldOrientation;
    let newOrientation = isTwist
        ? -1 * oldOrientation
        : +1 * oldOrientation;
    //let oppX = xInfo.opposite;
    let newWindingNum = oldWindingNum + windingNumberInc;
    /*
    oppX.orientation = ori;
    oppX.windingNum = newWindingNum;
    oppX.outerLoop = isTwist
            ? xInfo.outerLoop //aaa
            : xInfo.outerLoop;
    */
    return { /*isLeft,*/ newOrientation, newWindingNum };
}
