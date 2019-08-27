import { CpNode } from './cp-node/cp-node';
/**
 * Returns the ordered cubic bezier curves from this CpNode to the next CpNode
 * on the boundary.
 * @param cpNode
 */
declare function getBoundaryBezierPartsToNext(cpNode: CpNode): {
    ps: number[][];
    ts: number[];
}[];
export { getBoundaryBezierPartsToNext };
