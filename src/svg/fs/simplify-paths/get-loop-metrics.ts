
import { tangent } from 'flo-bezier3';
import { cross } from 'flo-vector2d';
import { X } from '../../../x/x';
import { ILoopTree } from './i-loop-tree';


/**
 * @hidden
 * @param x The intersection
 */
function getLoopMetrics(x: X) {
    let oppositeLoopTree = x.opposite.loopTree;
    let oppositeOrientation = oppositeLoopTree.orientation
    let oppositeWindingNum  = oppositeLoopTree.windingNum;            
    
    // Left or right turning? - The current X
    let oldInBez  = x.opposite.pos.curve.ps;
    let oldOutBez = x.         pos.curve.ps;    

    let orientation: number;
    let windingNum: number;

    let parent: ILoopTree;
    if (oldInBez !== oldOutBez) {
        let tanIn  = tangent(oldInBez,  x.opposite.pos.t);
        let tanOut = tangent(oldOutBez, x.         pos.t);
    
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

        parent = isTwist ? oppositeLoopTree.parent : oppositeLoopTree;
    } else {
        // This is the first loop's start - it's a special case
        orientation = oppositeOrientation === +1 ? -1 : +1
        windingNum = oppositeWindingNum + orientation;

        parent = oppositeLoopTree.parent;
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

    return iLoopTree;
}


export { getLoopMetrics }
