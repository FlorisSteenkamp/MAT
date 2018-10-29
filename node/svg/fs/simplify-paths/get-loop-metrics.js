"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const flo_vector2d_1 = require("flo-vector2d");
/**
 *
 * @param x The intersection
 */
function getLoopMetrics(x) {
    let oppositeLoopTree = x.opposite.loopTree;
    let oppositeOrientation = oppositeLoopTree.orientation;
    let oppositeWindingNum = oppositeLoopTree.windingNum;
    // Left or right turning? - The current X
    let oldInBez = x.opposite.pos.curve.ps;
    let oldOutBez = x.pos.curve.ps;
    let orientation;
    let windingNum;
    let parent;
    if (oldInBez !== oldOutBez) {
        let tanIn = flo_bezier3_1.tangent(oldInBez, x.opposite.pos.t);
        let tanOut = flo_bezier3_1.tangent(oldOutBez, x.pos.t);
        // TODO - if cross product is close to 0 check second derivatives (the 
        // same can be done at cusps in the mat code). E.g. a figure eight with 
        // coinciding bezier stretches may cause floating point instability.
        let isLeft = flo_vector2d_1.cross(tanIn, tanOut) > 0;
        let isTwist = (isLeft && oppositeOrientation === +1) ||
            (!isLeft && oppositeOrientation === -1);
        let windingNumberInc = isTwist
            ? -2 * oppositeOrientation
            : oppositeOrientation;
        orientation = isTwist
            ? -1 * oppositeOrientation
            : +1 * oppositeOrientation;
        windingNum = oppositeWindingNum + windingNumberInc;
        parent = isTwist ? oppositeLoopTree.parent : oppositeLoopTree;
    }
    else {
        // This is the first loop's start - it's a special case
        orientation = oppositeOrientation === +1 ? -1 : +1;
        windingNum = oppositeWindingNum + orientation;
        parent = oppositeLoopTree.parent;
    }
    let iLoopTree = {
        parent,
        children: new Set(),
        beziers: undefined,
        loop: undefined,
        orientation,
        windingNum
    };
    parent.children.add(iLoopTree);
    return iLoopTree;
}
exports.getLoopMetrics = getLoopMetrics;
//# sourceMappingURL=get-loop-metrics.js.map