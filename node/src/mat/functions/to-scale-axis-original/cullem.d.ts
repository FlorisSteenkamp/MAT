import { MatCircle } from '../../classes/mat-circle';
import { TTree } from './t-tree';
declare function cullem(node: MatCircle, key: string, s: number, tree: TTree, cullHash: {
    [index: string]: MatCircle;
}): void;
export { cullem };
