import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { CpNode, cpNodeComparator } from '../../../cp-node/cp-node.js';
import { PointOnShape } from '../../../point-on-shape/point-on-shape.js';
import { findAndAdd2Prongs } from './find-and-add-2-prongs.js';
import { checkOrdering } from '../check-ordering.js';


/** 
 * @internal
 * Add 2 prongs. See comments on the add2Prong function.
 * @param loops
 * @param cpGraphs
 * @param for2Prongss
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */ 
function findAndAdd2ProngsOnAllPaths(
        loops: Loop[],
        cpGraphs: Map<Loop,LlRbTree<CpNode>>,
        for2Prongss: PointOnShape[][],
        extreme: number) {

    let cpNode: CpNode | undefined;

    for (let k=0; k<for2Prongss.length; k++) {
        const for2Prongs = for2Prongss[k];
        const _cpNode = findAndAdd2Prongs(loops, cpGraphs, k, for2Prongs, extreme);
        cpNode = cpNode || _cpNode;
    }

    checkOrdering(cpNode!);

    return cpNode;
}


export { findAndAdd2ProngsOnAllPaths }
