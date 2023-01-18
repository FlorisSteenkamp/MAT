import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from '../../loop.js';
import { CpNode } from '../../cp-node.js';
import { IPointOnShape } from '../../point-on-shape.js';
import { findAndAdd2Prongs } from './find-and-add-2-prongs.js';


/** 
 * @hidden
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
        for2Prongss: IPointOnShape[][],
        extreme: number) {

    let cpNode;

    for (let k=0; k<for2Prongss.length; k++) {
        const for2Prongs = for2Prongss[k];
        const _cpNode = findAndAdd2Prongs(loops, cpGraphs, k, for2Prongs, extreme);
        cpNode = cpNode || _cpNode;
    }

    return cpNode;
}


export { findAndAdd2ProngsOnAllPaths }
