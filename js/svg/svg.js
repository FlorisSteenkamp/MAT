'use strict'

let Bezier = require('../geometry/classes/bezier.js'); 
let svgGetAndSetPathDataPolyFill = require('./path-data-polyfill/path-data-polyfill.js');
let LinkedLoop = require('../linked-loop/linked-loop.js');
let Geometry = require('../geometry/geometry.js');

let Svg = {};


/**
 * 
 */
Svg.getBeziersFromSvgElem = function(elem) {
	svgGetAndSetPathDataPolyFill(); // Ensure polyfill is applied.

	var paths = elem.getPathData();  
	
	//console.log(paths);
			
	let bezierArray = [];

	var x0 = paths[0].values[0];
	var y0 = paths[0].values[1];	
		
	var j = 0;
	for (var i=0; i<paths.length; i++) {
		var path = paths[i]; 
		if (path.type !== 'C' && path.type !== 'c') {
			continue; // TODO - add other curve types
		}
		
		var bezierPoints = [
			[x0, y0],
			[path.values[0], path.values[1]],
			[path.values[2], path.values[3]],
			[path.values[4], path.values[5]]
		];
		var bezier = new Bezier(bezierPoints, j);
			
		bezierArray.push(bezier);

		x0 = path.values[4]; 
		y0 = path.values[5];
		j++;
	}


	let bezArray;
	if (Geometry.isShapePositivelyOrientated(bezierArray)) {
		// We want all shapes to be negatively orientated.
		bezArray = reverseBeziersOrientation(bezierArray);
	} else {
		bezArray = bezierArray;
	}
	

	return new LinkedLoop(bezArray);
}


function reverseBeziersOrientation(bezArr) {
	let bezies = [];
	
	let idx = 0;
	for (let i=bezArr.length-1; i>=0; i--) {
		bezies.push(reverseBez(bezArr[i], idx));
		idx++;
	}
	
	return bezies;
}


function reverseBez(bezier, idx) {
	let bezierPoints = [];
	for (let i=3;i>=0;i--) {
		bezierPoints.push(bezier.bezierPoints[i]);
	}
	let newBezier = new Bezier(bezierPoints, idx);
	
	//console.log(bezier);
	//console.log(newBezier);
	
	return newBezier;
	
	
}


module.exports = Svg;

















