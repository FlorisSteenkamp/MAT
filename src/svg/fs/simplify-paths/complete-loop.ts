
declare var _debug_: MatDebug; 

import { MatDebug }   from '../../../debug/debug';

import { fromTo } from 'flo-bezier3';

import { Curve } from '../../../curve';

import { IXInfo } from './i-x-info';
import { ILoopTree  } from './i-loop-tree';

import { getNextX } from './get-next-x';


/**
 * Make a complete loop thus finding one componentLoop
 * @param intersections 
 * @param takenXs 
 * @param xStack
 * @param loop
 * @param xInfo
 */
function completeLoop(
        intersections : Map<Curve, IXInfo[]>,
        takenXs       : Set<IXInfo>,
        xStack        : IXInfo[],
        loop          : ILoopTree,
        xInfo         : IXInfo) {

    let beziers: number[][][] = [];

    let curBez = xInfo.opposite.pos.curve;
    let curT   = xInfo.opposite.pos.t;
    let endBez = xInfo.pos.curve;
    let endT   = xInfo.pos.t;
    if (curT === 1) {
        curBez = curBez.next;
        curT = 0;
    }

    let done = false;
    let i = 0;
    while (!done) {
        i++;
        let xInfos = intersections.get(curBez) || [];

        let xIdx = getNextX(xInfos, curBez, curT, endBez, endT);

        //---- Add a bezier to component loop
        if (xIdx !== undefined) {
            // We are at an intersection
            let xInfo = xInfos[xIdx];
            let endT = xInfo.pos.t;

            beziers.push( fromTo(curBez.ps)(curT, endT) );

            xInfo.loopTree = loop;
            if (!takenXs.has(xInfo.opposite)) {
                xStack.push(xInfo.opposite);
            }

            takenXs.add(xInfo); // Mark this intersection as taken

            // Move onto next bezier
            curBez = xInfo.opposite.pos.curve; // Switch to other path's bezier
            curT   = xInfo.opposite.pos.t; // ...
        } else {
            // For the final bezier, don't go beyond end point
            let maxT = 1; 
            if (curBez === endBez && curT <= endT && i > 1) {
                maxT = endT;
                done = true;
            }

            if (curT !== maxT) {
                beziers.push( fromTo(curBez.ps)(curT, maxT) );
            }

            // Move onto next bezier
            curBez = curBez.next; // Stay on current path
            curT   = 0;           // ...
        }
    }

    return beziers;
}


export { completeLoop }
