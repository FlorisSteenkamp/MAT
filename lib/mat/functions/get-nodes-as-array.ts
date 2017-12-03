
import traverse from './traverse'
import MatTree  from '../classes/mat-tree';
import MatNode  from '../classes/mat-node';

/**
 * Returns all the calculated MAT nodes as an array. 
 */
function getNodesAsArray(mat: MatTree) {
	let nodes: MatNode[] = [];
	
	traverse(mat, function(node) {
		nodes.push(node);
	});
	
	return nodes;
}


export default getNodesAsArray;
