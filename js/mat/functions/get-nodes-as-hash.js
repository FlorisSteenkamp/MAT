'use strict'

let PointOnShape = require('../../geometry/classes/point-on-shape.js');

let traverse = require('./traverse.js')


function getNodesAsHash(mat) {
	let nodes = {};
	
	traverse(mat, function(node) {
		let key = PointOnShape.makeSimpleKey(
				node.matCircle.circle.center
		);
		nodes[key] = node;
	});
	
	return nodes;
}


module.exports = getNodesAsHash;