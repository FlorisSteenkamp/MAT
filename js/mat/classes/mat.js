'use strict'

let traverse = require('../../mat/functions/traverse.js');


/**
 * @description The Mat class represents the end product, the Medial  
 * Axis Transform. It is defined recursively as a rooted tree with   
 * each node containing a point, a radius and 1, 2 or 3 branches.
 * 
 * @constructor
 * @param {MatNode} node - A handle on the MAT tree structure.
 */
function Mat(node) {
	this.startNode = node;
} 


Mat = Object.assign(Mat, {
	traverse	
});


module.exports = Mat;
