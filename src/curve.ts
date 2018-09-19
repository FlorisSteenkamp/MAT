
import Memoize from 'flo-memoize';

import { tangent } from 'flo-bezier3';
import { cross } from 'flo-vector2d';

import { Loop } from './loop';

let memoize = Memoize.m1;


class Curve {

	/** 
	 * Representation of a linked loop vertex (i.e. a bezier) within a linked loop.
	 * @param loop The linked loop this node belongs to.
	 * @param ps The actual item stored at a node.
	 * @param prev The previous item.
	 * @param next The next item.
	 * @param idx The curve's ordered index in the loop.
	 */
    constructor(
			public readonly loop : Loop, 
			public readonly ps   : number[][], 
			public          prev : Curve, 
			public          next : Curve,
			public readonly idx  : number) {

    	this.loop = loop;
    	this.ps   = ps;
    	this.prev = prev;	
		this.next = next;
		this.idx  = idx;
	}
	

	public static getCornerAtEnd(curve: Curve) {
		return getCornerAtEnd(curve);
	}
}


// Angle in degrees
const DEGREES = {
	//'0'    : 0.0000,
	0.25 : 0.0050,
	1    : 0.0167,
	4    : 0.0698,
	16   : 0.2756,
};

const DEGREE_LIMIT = DEGREES[1]; 


/**
 * Gets the cross of the unit tangents of the vector at the end of this
 * curve and the start of the next curve.
 */
let getCornerAtEnd = memoize(function(curve: Curve) {

	let tans = [
		tangent(curve.ps,      1), 
		tangent(curve.next.ps, 0)
	];

	let crossTangents = cross(tans[0], tans[1]);

	return { 
		tans, 
		crossTangents, 
		isSharp      : crossTangents < 0,
		isDull       : crossTangents > 0, 
		isQuiteSharp : crossTangents < -DEGREE_LIMIT,
		isQuiteDull  : crossTangents > +DEGREE_LIMIT 
	};
});


export { Curve };
