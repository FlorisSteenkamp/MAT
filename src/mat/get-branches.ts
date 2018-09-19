
// TODO - not working - fix

//import { findVertex  } from './find-vertex';


/**
 * Get the edges from the given MAT.
 * 
 * @param mat
 */
function getBranches(/*mat: Vertex*/) {	
	/*
	// Start at a node with 1 or 3 edges.
	//let startNode = findNode(mat.vertex, function(node) {
	let startNode = findVertex(mat, function(node) {		
		return node.getEdges().length !== 2;
	});
	

	g(startNode, undefined, 0);
	//console.log(edgeCount);
	
	function g(vertex: Vertex, priorVertex: Vertex, depth: number) {		
		let edges = vertex.getEdges();
		for (let i=0; i<edges.length; i++) {
			let edge = edges[i];
			if (edge.toVertex === priorVertex) {
				// Don't go back in tracks.
				continue;
			}
			
			let branch = traverseSingleBranch(
				vertex, i
			);

			for (let node of branch) {
				let color = ['red', 'blue', 'green'][i];
				
				//if (typeof FloMat !== 'undefined' && FloMat._debug_ && !FloMat._debug_.config.isTiming) {
				//	FloMat._debug_.draw.dot(node.vertex.circle.center, 1, color);
				//}
			}
			
			let endNode = branch[branch.length-1];
			let prevNode = branch[branch.length-2];

			//if (typeof FloMat !== 'undefined' && FloMat._debug_ && !FloMat._debug_.config.isTiming) {
			//	FloMat._debug_.draw.dot(endNode.vertex.circle.center, 2, 'yellow');	
			//}
			
			g(endNode, prevNode, depth + 1);
		}
	} 
	*/
}


/**
 * Traverses from the given node which should be a 3 or 1 prong to
 * the next 3 or 1 prong in the direction of the given edge index.
 */
function traverseSingleBranch(/*vertex: Vertex,*/ edgeIndx: number) {	
	/*
	let edge = [vertex]; 
	
	let edges = vertex.getEdges();
	g(edges[edgeIndx].toVertex, vertex);
	return edge;
	
	function g(vertex: Vertex, priorNode: Vertex) {
		edge.push(vertex);
		let edges = vertex.getEdges();
		if (edges.length !== 2) {
			return;
		}
		
		for (let edge of edges) {
			if (edge.toVertex === priorNode) {				
				// Don't go back in tracks.
				continue;
			}
			
			g(edge.toVertex, vertex);
		}			
	}
	*/
}


export { getBranches }
