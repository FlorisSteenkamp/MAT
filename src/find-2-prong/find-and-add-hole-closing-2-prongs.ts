import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { getShapeBounds } from '../svg/get-shape-bounds.js';
import { getMinYPos } from '../svg/get-min-y-pos.js';
import { find2Prong } from './find-2-prong.js';
import { add2Prong } from './add-2-prong.js';
import { MatMeta } from '../mat/mat-meta.js';


/**
 * @internal
 * Find and add two-prongs that remove any holes in the shape.
 * @param loops The loops (that as a precondition must be ordered from 
 * highest (i.e. smallest y-value) topmost point loops to lowest)
 * @param cpTrees
 * @param maxCoordinate The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAddHoleClosing2Prongs(
        meta: MatMeta) {

    const { loops } = meta;

    // Find the topmost points on each loop.
    const minYs = loops.map(getMinYPos);

    let cpNode: CpNode | undefined;

    // We start at 1 since 0 is the outer (root) loop
    for (let k=1; k<minYs.length; k++) {
        const posSource = minYs[k];
        
        const holeClosingTwoProng = find2Prong(
            meta, true, false, 0, posSource
        );

        if (!holeClosingTwoProng) { 
            throw new Error(`Unable to find hole-closing 2-prong`);
        } 

        // TODO important - handle case of n-prong, i.e. more than one antipode
        // - currently we only handle case of single antipode (the general case)
        const { circle, zs: posAntipodes } = holeClosingTwoProng;

        const _cpNode = add2Prong(meta, circle, [posSource, posAntipodes[0]], true);

        cpNode = cpNode === undefined ? _cpNode : cpNode;
    }

    return cpNode;
}


export { findAndAddHoleClosing2Prongs }
