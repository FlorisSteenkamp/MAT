import { Circle } from '../../circle';
import { TTree } from './t-tree';
/**
 * Traverses the spacial tree and calls the given callback function for each
 * MAT circle in the tree and iteravely for each subtree.
 * @param tree The spacial tree to traverse
 * @param f A function to call for each MAT circle in the tree.
 */
declare function traverseSpacialTree(tree: TTree, f: (circle: Circle) => void): void;
export { traverseSpacialTree };
