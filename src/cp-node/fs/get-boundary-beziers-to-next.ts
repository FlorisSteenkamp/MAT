import type { CpNode } from '../cp-node.js';
import { fromTo } from 'flo-bezier3';
import { getBoundaryBezierPartsToNext } from './get-boundary-bezier-parts-to-next.js';


/**
 * Returns the ordered bezier curves from this `CpNode` to the next `CpNode` 
 * on the boundary.
 * 
 * @param cpNode
 */
function getBoundaryBeziersToNext(
        cpNode: CpNode): number[][][] {

    return getBoundaryBezierPartsToNext(cpNode).map(
        bp => fromTo(bp.ps, bp.ts[0], bp.ts[1])
    );
}


export { getBoundaryBeziersToNext }
