import type { CpNode } from "../../src/cp-node/cp-node.js";
import { getAllOnLoop } from "../../src/cp-node/fs/get-all-on-loop.js";


/**
 * Returns the `CpNode` with the given `id` on the same loop as the given 
 * `CpNode` (throws if not found) - for picking out specific nodes of the 
 * `getMats1` fixture.
 */
function cpNodeById(
        cpNode: CpNode,
        id: number): CpNode {

    const found = getAllOnLoop(cpNode).find(cp => cp.id === id);
    if (!found) { throw new Error(`no CpNode with id ${id}`); }

    return found;
}


/** Returns a function mapping ids to `CpNode`s on the given loop. */
function cpNodesByIdOn(cpNode: CpNode) {
    return (id: number) => cpNodeById(cpNode, id);
}


export { cpNodeById, cpNodesByIdOn }
