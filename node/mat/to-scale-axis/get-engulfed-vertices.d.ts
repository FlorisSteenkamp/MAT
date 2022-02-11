import { Circle } from '../../circle.js';
import { TTree } from './t-tree.js';
/**
 * @hidden
 * Returns a map of engulfed MAT nodes determined to be engulfed by the given
 * test node and scale factor and starting from the given spacial tree node.
 * @param s The scale factor
 * @param tree The spacial tree node from where to start
 * @param circle The circle potentially engulfing other nodes
 */
declare function getEngulfedVertices(s: number, tree: TTree, circle: Circle): Set<Circle>;
export { getEngulfedVertices };
