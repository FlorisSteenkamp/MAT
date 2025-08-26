import { CpNode } from '../cp-node/cp-node.js';
import { findAndAdd3Prongs } from './find-and-add-3-prongs.js';
import { MatMeta } from '../mat/mat-meta.js';
import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';
import { removeVertex } from '../vertex/remove-vertex.js';
import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { drawFs } from 'flo-draw';
import { getAllOnCircle } from '../cp-node/fs/get-all-on-circle.js';


/**
 * @internal
 * Finds and adds all 3-prongs on a loop.
 *
 * @param meta
 * @param cpStart The CpNode to start traversing from. 
  */
function findAndAdd3ProngsOnLoop(
        meta: MatMeta,
        cpStart: CpNode | undefined): CpNode | undefined {

    if (cpStart === undefined) { return undefined!; }

    const cpNodeGoodSet = new Set<CpNode>();
    let reLoop = true;
    while (reLoop) {
        reLoop = false;
        const cpNodeSet = new Set(getAllOnLoop(cpStart));
        for (const cpNode of cpNodeSet) {

            const { closeBysFor3Prong, addedCpNodes } = 
                findAndAdd3Prongs(meta, cpNode);

            if (addedCpNodes.length > 0) { reLoop = true; }

            if (closeBysFor3Prong === undefined) {
                cpNodeGoodSet.add(cpNode);
            } else {
                reLoop = true;
                replaceCloseBys(meta.cpTrees, closeBysFor3Prong, cpNodeSet, cpNodeGoodSet);
            }

            addedCpNodes.forEach(cpNodes => cpNodes.forEach(cpNode => cpNodeGoodSet.add(cpNode)));
        }
        cpStart = getFirstItemOfSet(cpNodeGoodSet)!;
    }

    return getFirstItemOfSet(cpNodeGoodSet);
}


// From https://stackoverflow.com/a/73281564/2010061
function getFirstItemOfSet<T>(set: Set<T>) {
    for (const item of set) {
         return item;
    }

    return undefined;
}


// Unfortunately O(n) until Javascript gives us the simple ability to
// retrieve the first or last item of a set
function getLastItemOfSet<T>(set: Set<T>) {
    let item;
    for (item of set) {}

    return item;
}


function replaceCloseBys(
        cpTrees: Map<Loop,LlRbTree<CpNode>>,
        closeBysFor3Prong: CpNode[],
        cpNodeSet: Set<CpNode>,
        cpNodeGoodSet: Set<CpNode>) {

    for (const closeBy of [closeBysFor3Prong[0]]) {
        getAllOnCircle(closeBy).forEach(v => {
            cpNodeSet.delete(v);
            cpNodeGoodSet.delete(v);
        });
        removeVertex(closeBy, cpTrees);
    }
}


export { findAndAdd3ProngsOnLoop }
