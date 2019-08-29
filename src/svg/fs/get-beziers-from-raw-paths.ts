
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


/** @hidden */
const pathFs: { [index:string] : (s: PathState) => number[][] } = { 
	a, // elliptical arc
	c, // cubic bezier
	h, // horizontal line
	l, // line
	q, // quadratic bezier
	s, // cubic bezier (smooth)
	t, // quadratic bezier (smooth)
	v, // vertical line
	z  // close path
};
		

/**
 * @hidden
 * Returns order 1, 2 and 3 beziers from the given SVG DOM element. If a path
 * data tag is not "C, Q or L, etc", i.e. if it is not an absolute bezier
 * coordinate then it is converted into one.
 * @param paths An SVG element
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

	let prevType: string;
	for (let i=0; i<paths.length; i++) {
		let pathSeg = paths[i];
		
		let type = pathSeg.type.toLowerCase();
		s.vals = pathSeg.values;

		// If pathSeg was lowercase, it is relative - make absolute
		if (pathSeg.type === type) {
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
					beziers.push(z(s));
				}

				// Start new path
				beziersArrays.push(beziers);
				beziers = [];
			}

			s.initialPoint = s.p = s.vals;
			prevType = type;
			continue;
		}

		let f = pathFs[type];

		if (!f) { throw new Error('Invalid SVG - command not recognized.'); }

		let ps = f(s);

		s.p = ps[ps.length-1]; // Update current point

		beziers.push(ps);

		prevType = type;
	}


	if (beziers.length) {
		// This is a subpath, close as if the previous command was a Z or z.
		if (prevType !== 'z') {
			beziers.push(z(s));
		}

		// Start new path
		beziersArrays.push(beziers);
	}
	
	return beziersArrays;
}


export { getBeziersFromRawPaths }
