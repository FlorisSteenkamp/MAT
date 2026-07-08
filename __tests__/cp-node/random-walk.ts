import type { CpNode } from "../../src/cp-node/cp-node.js";
import { squares4 } from 'squares-rng';


const NEXT = 0;
const PREV = 1;
const NEXT_ON_CIRCLE = 2;
const PREV_ON_CIRCLE = 3;

function randomWalk(
        cpNode: CpNode,
        seed: number,
        steps: number): CpNode {

    for (let i=0; i<steps; i++) {
        const direction = squares4(seed + i) % 4;

        if (direction === NEXT) {
            cpNode = cpNode.next;
        } else if (direction === PREV) {
            cpNode = cpNode.prev;
        } else if (direction === NEXT_ON_CIRCLE) {
            cpNode = cpNode.nextOnCircle;
        } else if (direction === PREV_ON_CIRCLE) {
            cpNode = cpNode.prevOnCircle;
        }
    }

    return cpNode;
}


export { randomWalk }
