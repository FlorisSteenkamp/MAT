import { CpNode } from '../cp-node';
/**
 * @hidden
 * Returns a line segment of unit length starting in the given Vertex center and
 * pointing in the direction of the medial axis (viewed as a rooted tree).
 * @param cpNode
 */
declare function getEdgeDirection(cpNode: CpNode): number[][];
export { getEdgeDirection };
