
import { tangent } from 'flo-bezier3';
import { cross } from 'flo-vector2d';

import { IXInfo } from './i-x-info';
import { ILoopTree } from './i-loop-tree';


/**
 * 
 * @param xInfo The intersection
 */
function getLoopMetrics(xInfo: IXInfo) {
    let oppositeLoop = xInfo.opposite.loopTree;
    let oppositeOrientation = oppositeLoop.orientation
    let oppositeWindingNum  = oppositeLoop.windingNum;            
    
    // Left or right turning? - The current X
    let oldInBez  = xInfo.opposite.pos.curve.ps;
    let oldOutBez = xInfo.         pos.curve.ps;    

    let orientation: number;
    let windingNum: number;

    let parent: ILoopTree;
    if (oldInBez !== oldOutBez) {
        let tanIn  = tangent(oldInBez,  xInfo.opposite.pos.t);
        let tanOut = tangent(oldOutBez, xInfo.         pos.t);
    
        // TODO - if cross product is close to 0 check second derivatives (the 
        // same can be done at cusps in the mat code). E.g. a figure eight with 
        // coinciding bezier stretches may cause floating point instability.
        let isLeft = cross(tanIn, tanOut) > 0;
    
        let isTwist = 
            (isLeft  && oppositeOrientation === +1) ||
            (!isLeft && oppositeOrientation === -1);
        let windingNumberInc = isTwist 
            ? -2 * oppositeOrientation
            : oppositeOrientation;
        orientation = isTwist 
            ? -1 * oppositeOrientation
            : +1 * oppositeOrientation;
        windingNum = oppositeWindingNum + windingNumberInc;

        parent = isTwist ? oppositeLoop.parent : oppositeLoop;
    } else {
        // This is the first loop's start - it's a special case
        orientation = oppositeOrientation === +1 ? -1 : +1
        windingNum = oppositeWindingNum + orientation;

        parent = oppositeLoop.parent;
    }

    let iLoopTree: ILoopTree = { 
        parent,
        children : new Set(),
        beziers  : undefined, 
        loop     : undefined,
        orientation, 
        windingNum
    };

    parent.children.add(iLoopTree);

    return iLoopTree
}


export { getLoopMetrics }
