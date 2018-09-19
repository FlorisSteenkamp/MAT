import { MatCircle } from '../../classes/mat-circle';
import { MatNode } from '../../classes/mat-node';
import { TTree } from './t-tree';
declare function getCullNodes(s: number, tree: TTree, testNode: MatCircle): {
    [index: string]: MatNode;
};
export { getCullNodes };
