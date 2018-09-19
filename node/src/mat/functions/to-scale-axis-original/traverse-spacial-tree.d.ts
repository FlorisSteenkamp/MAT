import { MatCircle } from '../../classes/mat-circle';
import { TTree } from './t-tree';
declare function traverseSpacialTree(tree: TTree, f: (node: MatCircle, key: string, s: number, tree: TTree, cullHash: {
    [index: string]: MatCircle;
}) => void, s: number, tree2: TTree, cullHash: {
    [index: string]: MatCircle;
}): void;
export { traverseSpacialTree };
