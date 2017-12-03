import MatTree from '../classes/mat-tree';
import MatNode from '../classes/mat-node';
declare function getNodesAsHash(mat: MatTree): {
    [index: string]: MatNode;
};
export default getNodesAsHash;
