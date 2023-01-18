import { getBounds } from 'flo-bezier3';
import { memoize } from 'flo-memoize';
import { Loop } from '../loop.js';
import { Curve } from '../curve.js';
import { PointOnShape, IPointOnShape } from '../point-on-shape.js';


/** @hidden */
const INF = Number.POSITIVE_INFINITY;


/** 
 * @hidden 
 */
const getLoopBounds = memoize(function(loop: Loop): {
		minX: IPointOnShape;
		minY: IPointOnShape;
		maxX: IPointOnShape;
		maxY: IPointOnShape } {	

	const extremes: { 
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
		const ps = curve.ps; 
		// const bounds = getBounds_(ps);
		const bounds = getBounds(ps);
		
		
		{	
			{
				const v = bounds.box[0][0];
				const x = extremes[0][0].val;
				if (v < x || (v === x && bounds.ts[0][0] > extremes[0][0].t)) { 
					extremes[0][0] = { 
						bezier : curve, 
						t      : bounds.ts[0][0],
						val    : v
					};
				}
			}

			{
				const v = bounds.box[0][1];
				const x = extremes[0][1].val;
				if (v < x || (v === x && bounds.ts[0][1] > extremes[0][1].t)) { 
					extremes[0][1] = { 
						bezier : curve, 
						t      : bounds.ts[0][1],
						val    : v
					};
				}
			}
		}

		{	
			{
				const v = bounds.box[1][0];
				const x = extremes[1][0].val;
				if (v > x || (v === x && bounds.ts[1][0] > extremes[1][0].t)) { 
					extremes[1][0] = { 
						bezier : curve, 
						t      : bounds.ts[1][0],
						val    : v
					};
				}
			}

			{
				const v = bounds.box[1][1];
				const x = extremes[1][1].val;
				if (v > x || (v === x && bounds.ts[1][1] > extremes[1][1].t)) { 
					extremes[1][1] = { 
						bezier : curve, 
						t      : bounds.ts[1][1],
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
