import { orient2d } from 'big-float-ts';
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
function getInterfaceCcw(psI, psO) {
    let lenI = psI.length;
    // second last control point of incoming curve
    let p0 = psI[lenI - 2];
    // last control point of incoming curve / first control point of outgoing
    let p1 = psO[0];
    // second control point of outgoing curve
    let p2 = psO[1];
    /*
    if (typeof _bez_debug_ !== 'undefined') {
        let maxBitLength = 25;
        let p1_ = psI[lenI-1];
        // ---- precondition: does endpoints coincide
        if (p1_[0] !== p1[0] || p1_[1] !== p1[1]) {
            throw new Error('Curve endpoints must coincide.');
        }
        // ---- precondition: are coordinates grid-aligned
        // Get all coordinate values into an array
        let xs: number[] = [];
        [psI, psO].forEach(ps => ps.forEach(p => p.forEach(x => {
            xs.push(x);
        })));
        
        let msb = xs.reduce((prevX, x) => Math.max(prevX, msbExponent(x)), Number.NEGATIVE_INFINITY);
        let lsb = xs.reduce((prevX, x) => Math.min(prevX, lsbExponent(x)), Number.POSITIVE_INFINITY);
        let bitlengthAll = msb - lsb + 1;
        if (bitlengthAll > maxBitLength) {
            throw new Error(
                `Curve control point coordinates must be bit-aligned and <= ${maxBitLength}. bitlength === ${bitlengthAll}, coordinates: ${xs}`
            );
        }
    }
    */
    // Max one bit can be added in the calculations below due to bit-alignment
    let xE = p1[0] - p0[0]; // tangent x-coordinate
    let yE = p1[1] - p0[1]; // tangent y-coordinate
    let xS = p2[0] - p1[0]; // tangent x-coordinate
    let yS = p2[1] - p1[1]; // tangent y-coordinate
    // If the tangent is to be found at t === 0 or t === 1 then using a basic 
    // property of bezier curves we can find the tangents easily as below
    // (non-normalized) tangent of incoming curve at t === 1
    let tangentAtEnd = [xE, yE];
    // (non-normalized) tangent of outgoing curve at t === 0
    let tangentAtStart = [xS, yS];
    // The cross calculated below will have a max bitlength of 
    // (2*(maxBitLength+1))+1 === e.g. (2*(25+1)) + 1 === 53
    // If the preconditions are met it is exact
    //let crossTangents = cross(tangentAtEnd, tangentAtStart);
    // The cross below is exact by adaptive infinite precision
    let crossTangents = orient2d(p0, p1, p2);
    if (crossTangents !== 0) {
        return crossTangents;
    }
    // The dot calculated below will have a max bitlength of 
    // (2*(maxBitLength+1))+1 === e.g. (2*(25+1)) + 1 === 53
    // If the preconditions are met it is exact
    let dotTangents = dot(tangentAtEnd, tangentAtStart);
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
export { getInterfaceCcw };
//# sourceMappingURL=get-interface-ccw.js.map