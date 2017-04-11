'use strict'

let traverse = require('./traverse.js')


function getNodesAsArray(mat) {
	let nodes = [];
	
	traverse(mat, function(node) {
		nodes.push(node);
	});
	
	return nodes;
}


module.exports = getNodesAsArray;