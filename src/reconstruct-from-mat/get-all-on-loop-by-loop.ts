import type { CpNode } from '../cp-node/cp-node.js';


/**
 * Returns all `CpNode`s on the MAT that this `CpNode` is part of 
 * starting from the current one and going anti-clockwise around the shape.
 */
function getAllOnLoop_ByLoop(
        cpNode: CpNode) {

    const cpNodess: CpNode[][] = [];

    const cpStarts: CpNode[] = [cpNode];
    const cpStartSet = new Set(cpStarts);
    if (cpNode.isHoleClosing) {
        cpStartSet.add(cpNode.prevOnCircle.holeCloserTwin!);
    }
    cpStartSet.add(cpNode);

    while (cpStarts.length > 0) {
        const cpNodes: CpNode[] = [];

        const cpStart = cpStarts.pop()!;
        const _loop = cpStart.pointOnShape.curve.loop;
        let cpNode = cpStart;

        do {
            const loop = cpNode.pointOnShape.curve.loop;
            if (_loop === loop) {
                cpNodes.push(cpNode);
                cpNode = cpNode.next;
                continue;
            }

            const twin = cpNode.holeCloserTwin!;
            if (!cpStartSet.has(twin)) {
                cpStartSet.add(twin);
                cpStartSet.add(twin.prevOnCircle.holeCloserTwin!);
                cpStarts.push(twin);
            }

            cpNode = cpNode.prev.holeCloserTwin!;
        } while (cpNode !== cpStart);

        cpNodess.push(cpNodes);
    }

    return cpNodess;
}


export { getAllOnLoop_ByLoop }
