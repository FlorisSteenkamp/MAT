import { MatCircle } from '../../classes/mat-circle';
import { TTree } from './t-tree';
declare function createSpacialTree(s: number, nodeHash: {
    [index: string]: MatCircle;
}): TTree;
export { createSpacialTree };
