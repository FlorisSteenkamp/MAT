import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { findAndAdd2Prongs } from './find-and-add-2-prongs.js';
import { MatMeta } from '../mat/mat-meta.js';


/** 
 * @internal
 * Add 2 prongs. See comments on the add2Prong function.
 *
 * @param meta
 * @param angleIncrement
 * @param for2Prongss
 * @param for1Prongs
 */ 
function findAndAdd2ProngsOnAllLoops(
        meta: MatMeta,
        angleIncrement: number,
        for2Prongss: PointOnShape[][],
        for1Prongs: boolean) {

    let cpNode: CpNode | undefined;
    for (let k=0; k<for2Prongss.length; k++) {
        const for2Prongs = for2Prongss[k];
        const _cpNode = findAndAdd2Prongs(
            meta, angleIncrement, for2Prongs, for1Prongs
        );
        cpNode = cpNode === undefined ? _cpNode : cpNode;
    }

    return cpNode;
}


export { findAndAdd2ProngsOnAllLoops }
