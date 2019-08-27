import { CpNode } from '../../cp-node/cp-node';
/**
 * Get intersection between line and boundary piece.
 * @param line A line described by two points
 * @param cpNodes A boundary piece described by start and end contact points
  */
declare function getLineBoundaryIntersectionPoints(line: number[][], cpNodes: CpNode[]): number[][];
export { getLineBoundaryIntersectionPoints };
