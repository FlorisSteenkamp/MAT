import { Circle } from '../../circle.js';
import { TTree } from './t-tree.js';
/**
 * @hidden
 * @param s
 * @param tree
 * @param coordinate
 * @param limits
 * @param circle
 * @param depth
 */
declare function addToTree(s: number, tree: TTree, coordinate: number, limits: number[][], circle: Circle, depth: number): void;
export { addToTree };
