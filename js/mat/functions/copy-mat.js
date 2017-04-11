'use strict'

let MatNode = require('../../mat/classes/mat-node.js');
let Mat     = require('../classes/mat.js');


function copyMat(mat) {
	return new Mat(MatNode.copy(mat.startNode));
}


module.exports = copyMat;