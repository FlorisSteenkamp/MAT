import { memoize } from 'flo-memoize';
import { cross, dot, toUnitVector } from 'flo-vector2d';
import { getInterfaceCcw } from './get-interface-ccw.js';
/**
 * @hidden
 * Angle in degrees to radians.
 */
const DEGREES = {
    //'0'    : 0.0000,
    0.25: 0.0050,
    1: 0.0167,
    4: 0.0698,
    16: 0.2756,
};
/** @hidden */
//const DEGREE_LIMIT = DEGREES[1];
const DEGREE_LIMIT = DEGREES[4];
//const DEGREE_LIMIT = DEGREES[16]; 
/**
 * @hidden
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
function getCorner(psI, psO) {
    // getInterfaceCcw must return a number !== 0 if psI and psO are not the
    // same as seen as a curve extension with t ∈ [-∞,+∞]
    const ccw = getInterfaceCcw(psI, psO);
    const isSharp = ccw < 0;
    const isDull = ccw > 0;
    // Find (non-normalized) tangent of curve.ps at t === 1
    const p0E = psI[psI.length - 2];
    const p1E = psI[psI.length - 1];
    const xE = p1E[0] - p0E[0];
    const yE = p1E[1] - p0E[1];
    const tangentAtEnd = [xE, yE];
    // Find (non-normalized) tangent of curve.next.ps at t === 0
    const p0S = psO[0];
    const p1S = psO[1];
    const xS = p1S[0] - p0S[0];
    const yS = p1S[1] - p0S[1];
    const tangentAtStart = [xS, yS];
    // These use square root and are thus not exact
    const tangents_ = [
        toUnitVector(tangentAtEnd),
        toUnitVector(tangentAtStart),
    ];
    // The cross calculated below should be exact due to beziers having been
    // normalized!
    const crossTangents = cross(tangents_[0], tangents_[1]);
    let isQuiteSharp;
    let isQuiteDull;
    const dotTangents = dot(tangentAtEnd, tangentAtStart);
    if (dotTangents > 0) {
        // Curves go in same direction
        isQuiteSharp = crossTangents < -DEGREE_LIMIT;
        isQuiteDull = crossTangents > +DEGREE_LIMIT;
    }
    else {
        isQuiteSharp = isSharp;
        isQuiteDull = isDull;
    }
    return {
        tangents: tangents_,
        crossTangents,
        isSharp,
        isDull,
        isQuiteSharp,
        isQuiteDull
    };
}
/**
 * @hidden
 * Returns information about the corner created at the end of this curve
 * (at t === 1) and the start of the next curve (at t === 0).
 */
const getCornerAtEnd = memoize(function (curve) {
    const psE = curve.ps;
    const psS = curve.next.ps;
    return getCorner(psE, psS);
});
export { getCorner, getCornerAtEnd };
//# sourceMappingURL=curve.js.map