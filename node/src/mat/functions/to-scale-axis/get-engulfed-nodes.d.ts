import { Vertex } from '../../classes/vertex';
import { Circle } from '../../classes/circle';
import { TTree } from './t-tree';
/**
 * Returns a map of engulfed MAT nodes determined to be engulfed by the given
 * test node and scale factor and starting from the given spacial tree node.
 * @param s The scale factor
 * @param tree The spacial tree node from where to start
 * @param circle The circle potentially engulfing other nodes
 */
declare function getEngulfedNodes(s: number, tree: TTree, circle: Circle): Set<Vertex>;
export { getEngulfedNodes };
