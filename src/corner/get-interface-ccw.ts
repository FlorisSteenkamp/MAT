import { eAdd, eCompress, eEstimate, eMult, eNegativeOf, eProduct, orient2d, twoDiff } from 'big-float-ts';
// import { dot } from "flo-vector2d";
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
 * * The bezier does not have infinite curvature at either endpoint
 * 
 * @param psI The incoming bezier that ends at the interface
 * @param psO The outgoing bezier that starts at the interface
 */
function getInterfaceCcw(
        psI: number[][],
        psO: number[][]): {
            ccw: number,
            tangentI: number[][],
            tangentO: number[][],
            // crossTangents: number,
            dotTangents: number
        } {

    const lenI = psI.length;

    // second last control point of incoming curve
    let p0 = psI[lenI-2];  
    // last control point of incoming curve / first control point of outgoing
    let p1 = psO[0];
    // second control point of outgoing curve
    let p2 = psO[1];

    // infinite curvature - we're now handling this as well
    if (pointsEqual(p0,p1)) {
        p0 = psI[lenI-3];  // length cannot be 2
    }
    if (pointsEqual(p1,p2)) {
        p2 = psO[2];  // length cannot be 2
    }

    const crossTangents = crossPrecise(p0,p1,p2);  // sign will be correct

    const xI = twoDiff(p1[0],p0[0]);  // tangent x-coordinate
	const yI = twoDiff(p1[1],p0[1]);  // tangent y-coordinate
	const xO = twoDiff(p2[0],p1[0]);  // tangent x-coordinate
    const yO = twoDiff(p2[1],p1[1]);  // tangent y-coordinate

    const tangentI = [xI,yI];
    const tangentO = [xO,yO];
    const dotTangents = dotPrecise(tangentI,tangentO);

    if (crossTangents !== 0 || dotTangents > 0) {
		return {
            ccw: crossTangents,
            tangentI,
            tangentO,
            // crossTangents,
            dotTangents
        }
    }
    
    // Curves go in opposite directions at interface starting off with the exact
    // same tangent - look now at curvature to see which has the largest 
    // curvature so we can base the clock or anti-clockwise result on that

    // Look at curvature

    // TODO2
    // The line below is probably not working correctly for infinite
    // curvature but it should be rare to get here - investiagte.
    // Probably need to resort to length of tangents and then if this is
    // also the same simply look at the last point's ccw wrt the 1st or
    // the second?
    return {
        ccw: compareCurvaturesAtInterface(psI.slice().reverse(), psO),
        tangentI,
        tangentO,
        // crossTangents,
        dotTangents
    }
}


function pointsEqual(
        p1: number[],
        p2: number[]) {

    return p1[0] === p2[0] && p1[1] === p2[1];
}

/**
 * The input is two exact double-double coefficient vectors
 * 
 * * returns the correct sign
 */
function dotPrecise(
        tangentI: number[][],
        tangentO: number[][]): number {

    const abx = eMult(tangentI[0],tangentO[0]);
    const aby = eMult(tangentI[1],tangentO[1]);

    const dot = eAdd(abx,aby);

    return eEstimate(dot);
}


/**
 * Returns the cross from A to B to C
 * 
 * * returns the correct sign
 */
function crossPrecise(
        p0: number[],
        p1: number[],
        p2: number[]) {

    const a = twoDiff(p0[0],p2[0]);
    const b = twoDiff(p1[1],p2[1]);
    const c = twoDiff(p0[1],p2[1]);
    const d = twoDiff(p1[0],p2[0]);

    const e = eMult(a,b);
    const f = eMult(c,d);

    const g = eAdd(e,eNegativeOf(f));

    return eEstimate(g);
}


export { getInterfaceCcw }