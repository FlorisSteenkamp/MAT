import { eAdd, eEstimate, eMult, eNegativeOf, eProduct, orient2d, twoDiff } from 'big-float-ts';
import { dot } from "flo-vector2d";
import { compareCurvaturesAtInterface } from "./compare-curvatures-at-interface.js";


/**
 * Returns a positive value if the second bezier (of order 1, 2 or 3) curves 
 * anti-clockwise with respect to the first at the point where the first bezier 
 * ends and the second one starts. Returns a negative number if the turn is
 * clockwise. Returns 0 otherwise. 
 * 
 * The algorithm is a generalization of `ccw`, a.k.a `orient2d`.
 * 
 * The above obviously necessitates that their endpoints coincide as described.
 * 
 * Preconditions (for robustness):
 * * The beziers has control points with max bit-length of 25 and bit-aligned.
 * * The bezier does not have infinite curvature at either endpoint
 * 
 * This is so the vectors between control points can be 
 * calculated exactly without resorting to adaptive infinite precision floating 
 * point operations. Note: aligned to 'grid' here means if you bitwise-and all
 * values together the resulting bitlength === the max bithlength of any value.
 * 
 * @param psI The incoming bezier that ends at the interface
 * @param psO The outgoing bezier that starts at the interface
 */
// TODO - improve and make at least 46-bitlength precondition
function getInterfaceCcw(psI: number[][], psO: number[][]) {
    const lenI = psI.length;

    // second last control point of incoming curve
    const p0 = psI[lenI-2];  
    // last control point of incoming curve / first control point of outgoing
    const p1 = psO[0];
    // second control point of outgoing curve
    const p2 = psO[1];

    // Max one bit can be added in the calculations below due to bit-alignment
    const xE = p1[0] - p0[0];  // tangent x-coordinate
	const yE = p1[1] - p0[1];  // tangent y-coordinate
	const xS = p2[0] - p1[0];  // tangent x-coordinate
    const yS = p2[1] - p1[1];  // tangent y-coordinate
    
	// If the tangent is to be found at t === 0 or t === 1 then using a basic 
    // property of bezier curves we can find the tangents easily as below
    
    // (non-normalized) tangent of incoming curve at t === 1
    const tangentAtEnd = [xE,yE];
    // (non-normalized) tangent of outgoing curve at t === 0
	const tangentAtStart = [xS,yS];

    // const crossTangents = orient2d(p0, p1, p2);
    const crossTangents = orient2dPrecise(p0, p1, p2);

	if (crossTangents !== 0) {
		return crossTangents;
    } 
    
    // The dot calculated below will have a max bitlength of 
    // (2*(maxBitLength + 1)) + 1 === e.g. (2*(25 + 1)) + 1 === 53
    // If the preconditions are met it is exact
    const dotTangents = dot(tangentAtEnd, tangentAtStart);
    if (dotTangents > 0) {
        // Curves go in same direction at interface - neither clock or 
        // anti-clockwise.
        // Note: The above comment is not strictly true but as this case is not
        // important for the algorithm we return 0
        return 0;
    } 

    // Curves go in opposite directions at interface starting off with the exact
    // same tangent - look now at curvature to see which has the largest 
    // curvature so we can base the clock or anti-clockwise result on that
    
    // Look at curvature
    return compareCurvaturesAtInterface(psI.slice().reverse(), psO);
}


/** Returns the cross from A to B to C */
function orient2dPrecise(
        A: number[],
        B: number[],
        C: number[]) {

    // const detleft  = (A[0] - C[0]) * (B[1] - C[1]);
    // const detright = (A[1] - C[1]) * (B[0] - C[0]);
    // const det = detleft - detright;

    const a = twoDiff(A[0],C[0]);
    const b = twoDiff(B[1],C[1]);
    const c = twoDiff(A[1],C[1]);
    const d = twoDiff(B[0],C[0]);

    const e = eMult(a,b);
    const f = eMult(c,d);

    const g = eAdd(e,eNegativeOf(f));

    return eEstimate(g);
}


export { getInterfaceCcw }