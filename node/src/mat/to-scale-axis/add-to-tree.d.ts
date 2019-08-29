import { Circle } from '../../circle';
import { TTree } from './t-tree';
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
