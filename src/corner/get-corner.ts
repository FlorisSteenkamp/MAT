import { cross, dot, toUnitVector } from "flo-vector2d";
import { Corner } from "./corner.js";
import { getInterfaceCcw } from './get-interface-ccw.js';


/** 
 * @internal
 * Angle in degrees to radians.
 */
const DEGREES = {
	//'0'    : 0.0000,
	0.25 : 0.0050,
	1    : 0.0167,
	4    : 0.0698,
	16   : 0.2756,
};


/** @internal */
//const DEGREE_LIMIT = DEGREES[1];
const DEGREE_LIMIT = DEGREES[4]; 
//const DEGREE_LIMIT = DEGREES[16]; 


/**
 * @internal
 * Returns a new corner with properties.
 * 
 * PRECONDITION: The beziers has control points with max bit-length of 26 and
 * aligned to a 'grid' to have the same exponent. This is so the vectors between
 * control points can be calculated exactly without resorting to adaptive 
 * infinite precision floating point operations.
 * 
 * @param psI The incoming bezier that ends in the corner
 * @param psO The outgoing bezier that starts at the corner
 */
function getCorner(
		psI: number[][],
		psO: number[][]): Corner {

	// getInterfaceCcw must return a number !== 0 if psI and psO are not the
	// same as seen as a curve extension with t ∈ [-∞,+∞]
	const { ccw, tangentI, tangentO, dotTangents } = getInterfaceCcw(psI, psO);
	const isSharp = ccw < 0;
	const isDull  = ccw > 0;

	// These use square root and are thus not exact
	const unitTangents = [
		toUnitVector(tangentI.map(v => v[1])),
		toUnitVector(tangentO.map(v => v[1])),
	];

	// The cross calculated below should be exact due to beziers having been
	// normalized!
	const crossTangents = cross(unitTangents[0], unitTangents[1]);

	let isQuiteSharp: boolean; 
	let isQuiteDull: boolean; 
	// const dotTangents = dot(tangentAtIncoming, tangentAtOutgoing);
	if (dotTangents > 0) {
		// Curves go in same direction
		isQuiteSharp = crossTangents < -DEGREE_LIMIT;
		isQuiteDull = crossTangents > +DEGREE_LIMIT;
	} else {
		isQuiteSharp = isSharp;
		isQuiteDull  = isDull;
	}

	return {
		tangents: unitTangents, 
		// crossTangents, 
		isSharp,
		isDull, 
		isQuiteSharp,
		isQuiteDull
	};
}


export { getCorner }
