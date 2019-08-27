import { CpNode } from '../../cp-node/cp-node';
/**
 * Cull all edges not part of a cycle in the MAT planar graph.
 * @param cpStart The start CpNode which must reprsesent the maximal 3-prong
 * vertex.
 */
declare function cullNonCycles(cpStart: CpNode): CpNode;
export { cullNonCycles };
