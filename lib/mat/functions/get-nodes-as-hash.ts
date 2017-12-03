
import PointOnShape from '../../geometry/classes/point-on-shape';
import traverse     from './traverse';
import MatTree      from '../classes/mat-tree';
import MatNode      from '../classes/mat-node';


function getNodesAsHash(mat: MatTree) {
	let nodes: { [index:string]: MatNode } = {};
	
	traverse(mat, function(node) {
		let key = PointOnShape.makeSimpleKey(
				node.matCircle.circle.center
		);
		nodes[key] = node;
	});
	
	return nodes;
}


export default getNodesAsHash;