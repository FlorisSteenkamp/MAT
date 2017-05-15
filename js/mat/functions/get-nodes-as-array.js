'use strict'

let traverse = require('./traverse.js')

/**
 * @description Returns all the calculated MAT nodes as an array. 
 */
function getNodesAsArray(mat) {
	let nodes = [];
	
	traverse(mat, function(node) {
		nodes.push(node);
	});
	
	return nodes;
}


module.exports = getNodesAsArray;