
import { pushBezier } from '../fs/push-bezier';
import { PathState  } from '../path-state';

import { z } from '../path-segment/z';
import { c } from '../path-segment/c';
import { s } from '../path-segment/s';
import { l } from '../path-segment/l';
import { h } from '../path-segment/h';
import { v } from '../path-segment/v';
import { q } from '../path-segment/q';
import { t } from '../path-segment/t';
import { a } from '../path-segment/a';


const pathFs: { [index:string] : (s: PathState) => number[][] } = 
		{ a, c, h, l, q, s, t, v, z };
		

/**
 * Get the cubic beziers from the given SVG DOM element. If a path
 * data tag is not "C", i.e. if it is not an absolute cubic bezier
 * coordinate then it is converted into one.
 * @param elem - An SVG element
 * @returns aaa
 */
function getBeziersFromRawPaths(paths: { type: string, values: number[] }[]) {

	if (paths.length === 0) {
		return []; // A shape is not described   
	}
	
	if (paths[0].type.toLowerCase() !== 'm') {
		throw new Error(
			'Invalid SVG - every new path must start with an M or m.'
		); 
	}


	let s = new PathState();


	let beziersArrays: number[][][][] = [];
	let beziers: number[][][] = [];


	let max = Number.NEGATIVE_INFINITY;
	for (let i=0; i<paths.length; i++) {
		let path = paths[i];
		for (let j=0; j<path.values.length; j++) {
			let v = path.values[j];
			if (max < v) { max = v; }
		}
	}


	let type: string = undefined;
	let prevType;
	for (let i=0; i<paths.length; i++) {
		prevType = type;

		let pathSeg = paths[i];
		
		type = pathSeg.type.toLowerCase();
		s.vals = pathSeg.values;

		/*
		if (pathSeg.values[0] === 109.637) {
			console.log('109')
		}
		*/

		if (pathSeg.type === pathSeg.type.toLowerCase()) {
			if (type === 'v') {
				s.vals[0] += s.p[1];
			} else if (type === 'a') {
				s.vals[5] += s.p[0];
				s.vals[6] += s.p[1];
			} else {
				for (let i=0; i<s.vals.length; i++) {
					s.vals[i] += s.p[i%2];
				}
			}
		}

		if (type === 'm') {
			if (beziers.length) {
				// This is a subpath, close as if the previous command was a 
				// Z or z.
				if (prevType !== 'z') {
					pushBezier(beziers, z(s), s, max); 
				}

				// Start new path
				beziersArrays.push(beziers);
				beziers = [];
			}

			s.initialPoint = s.p = s.vals;
			continue;
		}

		let f = pathFs[type];

		if (!f) { throw new Error('Invalid SVG - command not recognized.'); }

		let ps = f(s);

		s.p = ps[3]; // Update current point

		pushBezier(beziers, ps, s, max); 
	}


	if (beziers.length) {
		//beziersArrays.push(beziers);

		// This is a subpath, close as if the previous command was a 
		// Z or z.
		if (prevType !== 'z') {
			pushBezier(beziers, z(s), s, max); 
		}

		// Start new path
		beziersArrays.push(beziers);
	}
	
	return beziersArrays;
}


export { getBeziersFromRawPaths }
