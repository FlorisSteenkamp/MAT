
import Memoize from 'flo-memoize';

import { getBounds } from 'flo-bezier3';

import { Loop         } from '../../loop';
import { Curve        } from '../../curve';
import { PointOnShape } from '../../point-on-shape';

let { m1: memoize } = Memoize;

const INF = Number.POSITIVE_INFINITY;


let getLoopBounds = memoize(function(loop: Loop) {		
	let extremes: { 
		bezier: Curve, 
		t: number, 
		val: number 
	}[][] = [
		[
			{ bezier: undefined, t: undefined, val: INF}, 
			{ bezier: undefined, t: undefined, val: INF}
		], 
		[
			{ bezier: undefined, t: undefined, val: -INF}, 
			{ bezier: undefined, t: undefined, val: -INF}
		]
	];
	
	loop.curves.forEach(function(curve: Curve): void {			
		let ps = curve.ps; 
		let bounds = getBounds(ps);
		
		for (let i=0; i<2; i++) {
			for (let j=0; j<2; j++) {
				let v = bounds.box[i][j];
				let m = i === 0 ? -1 : 1; // min or max?
				let x = extremes[i][j].val;
				if (m*v > m*x || (v === x && bounds.ts[i][j] > extremes[i][j].t)) { 
					extremes[i][j] = { 
						bezier : curve, 
						t      : bounds.ts[i][j],
						val    : v
					};
				}
			}
		}
	});

	return {
		minX : new PointOnShape(extremes[0][0].bezier, extremes[0][0].t),
		minY : new PointOnShape(extremes[0][1].bezier, extremes[0][1].t),
		maxX : new PointOnShape(extremes[1][0].bezier, extremes[1][0].t),
		maxY : new PointOnShape(extremes[1][1].bezier, extremes[1][1].t)
	};
});


export { getLoopBounds }
