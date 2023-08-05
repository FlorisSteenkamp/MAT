/** @internal */
declare const _debug_: Debug; 

import { LlRbTree } from 'flo-ll-rb-tree';
import { Debug } from '../debug/debug.js';
import { CpNode, getCpNodesOnCircle } from '../cp-node/cp-node.js';
import { Loop } from 'flo-boolean';
import { isPosSharpCorner } from '../point-on-shape/is-pos-sharp-corner.js';
import { fixOrdering } from '../find-mat/fix-ordering.js';
import { findAndAdd3Prongs } from './find-and-add-3-prongs.js';


interface Edge {
    fromCpNode: CpNode;
    cpStart: CpNode;
}


/**
 * @internal
 * Finds and adds all 3-prongs.
 * @param cpGraphs
 * @param cpStart The CpNode to start traversing from. 
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAddAll3Prongs(
        cpGraphs: Map<Loop,LlRbTree<CpNode>>,
        cpStart: CpNode,
        extreme: number) {

    // Don't change this function to be recursive, the call stack may overflow 
    // if there are too many two-prongs.

    const visitedEdges = new Map<CpNode, Set<CpNode>>();

    const edgesToCheck: Edge[] = [{ fromCpNode: undefined! as CpNode, cpStart }];

    while (edgesToCheck.length) {
        const { fromCpNode, cpStart } = edgesToCheck.shift()!;

        markEdgeAsTaken(visitedEdges, fromCpNode, cpStart);
        
        for (const cpNode of getCpNodesOnCircle(cpStart)) {

            if (!isPosSharpCorner(cpNode.cp.pointOnShape)) {
                if (findAndAdd3Prongs(cpGraphs, cpNode, extreme) === undefined) {
                    console.log('Unable to find 3-prong');
                    return; // only for debugging purposes
                }
            }

            if (hasEdgeBeenTaken(visitedEdges, cpNode, cpNode.next)) {
                continue; // We already visited this edge
            }

            edgesToCheck.push({ fromCpNode: cpStart, cpStart: cpNode.next }); 
        }
    }

    // for (const [k,v] of cpGraphs) {
    //     fixOrdering(v.root!.datum);
    // }
}


/**
 * @internal
 * Marks the given edge as already taken.
 */
function markEdgeAsTaken(
        visitedEdges: Map<CpNode, Set<CpNode>>,
        cp1: CpNode, 
        cp2: CpNode) {

    if (cp1 === undefined) { return; }

    markEdgeAsTaken_(cp1, cp2);
    markEdgeAsTaken_(cp2, cp1);

    function markEdgeAsTaken_(cp1: CpNode, cp2: CpNode) {
        let visited = visitedEdges.get(cp1);
        if (!visited) { 
            visited = new Set<CpNode>();
            visitedEdges.set(cp1, visited);
        }  
        visited.add(cp2);
    }
}


/** @internal */
function hasEdgeBeenTaken(
        visitedEdges: Map<CpNode, Set<CpNode>>,
        cp1: CpNode, 
        cp2: CpNode) {

    let cps: Set<CpNode> | undefined;

    cps = visitedEdges.get(cp1);
    const takenForward = cps && cps.has(cp2); 

    cps = visitedEdges.get(cp2);
    const takenBackwards = cps && cps.has(cp1); 

    return takenForward || takenBackwards;
}

export { findAndAddAll3Prongs }
