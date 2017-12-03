
import MatNode from '../../mat/classes/mat-node';
import MatTree from '../classes/mat-tree';


function copyMat(matTree: MatTree) {
	return new MatTree(MatNode.copy(matTree.startNode));
}


export default copyMat;
