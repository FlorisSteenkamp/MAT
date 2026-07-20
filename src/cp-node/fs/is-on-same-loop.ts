import type { CpNode } from "flo-mat";


function isOnSameLoop(
        cpNode1: CpNode,
        cpNode2: CpNode): boolean {

    return (
        cpNode1.pointOnShape.curve.loop === 
        cpNode2.pointOnShape.curve.loop
    );
}


export { isOnSameLoop }