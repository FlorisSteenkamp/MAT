"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const get_next_x_1 = require("./get-next-x");
/**
 * Make a complete loop thus finding one componentLoop
 * @param intersections
 * @param takenXs
 * @param xStack
 * @param loop
 * @param xInfo
 */
function completeLoop(intersections, takenXs, xStack, loop, xInfo) {
    let beziers = [];
    let curBez = xInfo.opposite.pos.curve;
    let curT = xInfo.opposite.pos.t;
    let endBez = xInfo.pos.curve;
    let endT = xInfo.pos.t;
    if (curT === 1) {
        curBez = curBez.next;
        curT = 0;
    }
    let done = false;
    let i = 0;
    while (!done) {
        i++;
        let xInfos = intersections.get(curBez) || [];
        let xIdx = get_next_x_1.getNextX(xInfos, curBez, curT, endBez, endT);
        //---- Add a bezier to component loop
        if (xIdx !== undefined) {
            // We are at an intersection
            let xInfo = xInfos[xIdx];
            let endT = xInfo.pos.t;
            beziers.push(flo_bezier3_1.fromTo(curBez.ps)(curT, endT));
            xInfo.loopTree = loop;
            if (!takenXs.has(xInfo.opposite)) {
                xStack.push(xInfo.opposite);
            }
            takenXs.add(xInfo); // Mark this intersection as taken
            // Move onto next bezier
            curBez = xInfo.opposite.pos.curve; // Switch to other path's bezier
            curT = xInfo.opposite.pos.t; // ...
        }
        else {
            // For the final bezier, don't go beyond end point
            let maxT = 1;
            if (curBez === endBez && curT <= endT && i > 1) {
                maxT = endT;
                done = true;
            }
            if (curT !== maxT) {
                beziers.push(flo_bezier3_1.fromTo(curBez.ps)(curT, maxT));
            }
            // Move onto next bezier
            curBez = curBez.next; // Stay on current path
            curT = 0; // ...
        }
    }
    return beziers;
}
exports.completeLoop = completeLoop;
