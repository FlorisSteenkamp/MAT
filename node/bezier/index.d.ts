import { ICurriedMapFunction2 } from 'flo-vector2d';
import { ICurriedMapFunctionSpecial } from 'flo-vector2d';
import { getX } from './src/get-x';
import { getY } from './src/get-y';
import { getDx } from './src/get-dx';
import { getDy } from './src/get-dy';
import { evaluateX } from './src/evaluate-x';
import { evaluateY } from './src/evaluate-y';
import { evaluate } from './src/evaluate';
import { evaluateDx } from './src/evaluate-dx';
import { evaluateDy } from './src/evaluate-dy';
import { tangent } from './src/tangent';
import { normal } from './src/normal';
import { from0ToT } from './src/from-0-to-T';
import { fromTTo1 } from './src/from-T-to-1';
import { fromTo } from './src/from-to';
import { toHybridQuadratic } from './src/to-hybrid-quadratic';
import { coincident } from './src/coincident';
import { lineIntersection } from './src/line-intersection';
import { bezier3Intersection } from './src/bezier3-intersection/bezier3-intersection';
import { bezier3IntersectionSylvester } from './src/bezier3-intersection-sylvester/bezier3-intersection-sylvester_';
import { tsAtX } from './src/ts-at-x';
import { tsAtY } from './src/ts-at-y';
import { BezDebug } from './src/debug/debug';
import { IDrawFunctions } from './src/debug/draw-functions';
import { DebugElemType } from './src/debug/debug';
import { FatLine } from './src/debug/fat-line';
import { deCasteljau } from './src/de-casteljau';
import { evalDeCasteljau } from './src/eval-de-casteljau';
declare let rotate: ICurriedMapFunctionSpecial<number, number, number[], number[]>;
declare let translate: ICurriedMapFunction2<number[], number[], number[]>;
/**
 * Returns the second derivative of the power basis representation of the
 * bezier's x-coordinates. This function is memoized on its points parameter by
 * object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The twice differentiated power basis polynomial from
 * highest power to lowest, e.g. at + b is returned as [a,b]
 */
declare let getDdx: (a: number[][]) => number[];
/**
 * Returns the second derivative of the power basis representation of the
 * bezier's y-coordinates. This function is memoized on its points parameter by
 * object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The twice differentiated power basis polynomial from
 * highest power to lowest, e.g. at + b is returned as [a,b]
 */
declare let getDdy: (a: number[][]) => number[];
/**
 * Returns the third derivative of the power basis representation of the
 * bezier's x-coordinates. This function is memoized on its points parameter by
 * object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The thrice differentiated power basis polynomial (a
 * constant in array from), e.g. a is returned as [a]
 */
declare let getDddx: (a: number[][]) => number[];
/**
 * Returns the third derivative of the power basis representation of the
 * bezier's y-coordinates. This function is memoized on its points parameter by
 * object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The thrice differentiated power basis polynomial (a
 * constant in array from), e.g. a is returned as [a]
 */
declare let getDddy: (a: number[][]) => number[];
/**
 * Returns the convex hull of a bezier's control points. This hull bounds the
 * bezier curve. This function is memoized.
 *
 * The tolerance at which the cross product of two nearly collinear lines of the
 * hull are considered collinear is 1e-12.
 * @param ps - A bezier curve, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns An ordered array of convex hull points.
 */
declare let getBoundingHull: (a: number[][]) => number[][];
/**
 * Returns a cubic bezier from the given line with evenly spaced control points.
 * @param l - a 2d line represented by two points
 * @returns Control points of the cubic bezier.
 */
declare function fromLine(l: number[][]): number[][];
/**
 * Returns the curvature, κ, at a specific t. This function is curried. Alias
 * of curvature.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t - The parameter value where the curvature should be
 * evaluated
 */
declare function κ(ps: number[][], t: number): number;
declare function κ(ps: number[][]): (t: number) => number;
/**
 * Alias of κ.
 */
declare let curvature: typeof κ;
/**
 * Helper function. This function is curried.
 * A modified version of the differential of κ (use quotient rule, ignore
 * denominator and multiply by 2/3). We need to find the zeros of this function
 * to get the min/max curvature.
 * See <a href="http://math.info/Calculus/Curvature_Parametric/">this</a> for
 * more details.
 * @ignore
**/
declare function dκMod(ps: number[][], t: number): number;
declare function dκMod(ps: number[][]): (t: number) => number;
/**
 * TODO - replace this function by simply checking tangents at beginning and
 * end of curve.
 * Returns the total curvature of the bezier over the given interval using
 * Gaussian Quadrature integration with 16 wieghts and abscissas which is
 * generally very accurate and fast. This function is curried.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param interval - The interval of integration (often === [0,1])
 * @returns The total curvature.
 */
declare function totalCurvature(ps: number[][], interval: number[]): number;
declare function totalCurvature(ps: number[][]): (interval: number[]) => number;
/**
 * TODO - replace this function with a more sane version where total curvature
 * is tallied by looking for inflection points and adding curvature over those
 * pieces by looking at tangent at beginning and end of the pieces.
 * Returns the total absolute curvature of the bezier over [0,1] using Gaussian
 * Quadrature integration with 16 wieghts and abscissas which is generally very
 * accurate and fast. Returns the result in radians.
 * @param ps - A cubic bezier
 * @param interval
 */
declare function totalAbsoluteCurvature(ps: number[][], interval: number[]): number;
declare function totalAbsoluteCurvature(ps: number[][]): (interval: number[]) => number;
/**
 * Returns the curve (linear, quadratic or cubic bezier) length in the specified
 * interval. This function is curried.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param interval - The paramter interval over which the length is
 * to be calculated (often === [0,1]).
 */
declare function length(interval: number[], ps: number[][]): number;
declare function length(interval: number[]): (ps: number[][]) => number;
/**
 * Returns the t parameter value where the given cubic bezier reaches the given
 * length, s, starting from t = 0. This function is curried.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param s - The length
 */
declare function getTAtLength(ps: number[][], s: number): number;
declare function getTAtLength(ps: number[][]): (s: number) => number;
/**
 * Returns the x value of the twice differentiated (with respect to t) cubic
 * bezier when evaluated at t. This function is curried.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t - The t parameter
 * @returns
 */
declare function evaluateDdx(ps: number[][], t: number): number;
declare function evaluateDdx(ps: number[][]): (t: number) => number;
/**
 * Returns the y value of the twice differentiated (with respect to t) cubic
 * bezier when evaluated at t. This function is curried.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t - The t parameter
 * @returns
 */
declare function evaluateDdy(ps: number[][], t: number): number;
declare function evaluateDdy(ps: number[][]): (t: number) => number;
/**
 * Returns the x value of the thrice differentiated (with respect to t) cubic
 * bezier when evaluated at t. This function is curried.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t - The t parameter
 */
declare function evaluateDddx(ps: number[][], t: number): number;
declare function evaluateDddx(ps: number[][]): (t: number) => number;
/**
 * Returns the y value of the thrice differentiated (with respect to t) cubic
 * bezier when evaluated at t. This function is curried.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t - The t parameter
 */
declare function evaluateDddy(ps: number[][], t: number): number;
declare function evaluateDddy(ps: number[][]): (t: number) => number;
/**
 * Returns the tight bounding box of the given cubic bezier.
 * @returns The tight bounding box of the bezier as four ordered
 * points of a rotated rectangle.
 * TODO - test case of baseLength === 0
 */
declare let getBoundingBoxTight: (a: number[][]) => number[][];
/**
 * Returns the axis-aligned bounding box of a given bezier.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns the axis-aligned bounding box in the form
 * [[minx, miny], [maxx,maxy]
 */
declare let getBoundingBox: (a: number[][]) => number[][];
/**
 * Calculates and returns general bezier bounds.
 * @returns The axis-aligned bounding box together with the t values
 * where the bounds on the bezier are reached.
 */
declare let getBounds: (a: number[][]) => {
    ts: number[][];
    box: number[][];
};
/**
 * Returns 2 new beziers split at the given t parameter, i.e. for the ranges
 * [0,t] and [t,1]. Uses de Casteljau's algorithm.
 *
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * @param ps - A cubic bezier curve
 * @param t - The t parameter where the curve should be split
 */
declare function splitAt(ps: number[][], t: number): number[][][];
/**
 * Returns a new bezier from the given bezier by limiting its t range.
 *
 * Uses de Casteljau's algorithm.
 *
 * @param ps A bezier
 * @param tRange A t range
 */
declare function bezierFromBezierPiece(ps: number[][], tRange: number[]): number[][];
/**
 * Scales all control points of the given bezier by the given factor.
 * @param ps - A bezier curve
 * @param c - The scale factor
 */
declare function scale(ps: number[][], c: number): number[][];
/**
 * Returns the best least squares quadratic bezier approximation to the given
 * cubic bezier. Note that the two bezier endpoints differ in general.
 * @param ps - A cubic bezier curve.
 */
declare function toQuadratic(ps: number[][]): number[][];
/**
 * Evaluates the given hybrid quadratic at the given t and th parameters. (see
 * toHybridQuadratic for details).
 * @param hq - A hybrid quadratic
 * @param t - The bezier parameter value
 * @param th - The parameter value for the hybrid quadratic point.
 */
declare function evaluateHybridQuadratic(hq: (number[] | number[][])[], t: number, th: number): number[];
/**
 * Evaluates the given linear bezier (line) at a specific t value.
 * @param ps - A linear bezier curve.
 * @param t - The value where the bezier should be evaluated
 */
declare function evaluateLinear(ps: number[][], t: number): number[];
/**
 * Returns a clone of the given cubic bezier. Use sparingly; this is not in the
 * spirit of functional programming.
 * @param ps - A cubic bezier given by its array of control points
 */
declare function clone(ps: number[][]): number[][];
/**
 * Evaluates the given quadratic bezier at a specific t value.
 * @param ps - A quadratic bezier curve.
 * @param t - The value where the bezier should be evaluated
 */
declare function evaluateQuadratic(ps: number[][], t: number): number[];
/**
 * Returns the cubic version of the given quadratic bezier curve. Quadratic
 * bezier curves can always be represented by cubics - the converse is false.
 * @param ps - A quadratic bezier curve.
 */
declare function quadraticToCubic(ps: number[][]): number[][];
declare function linearToCubic(ps: number[][]): number[][];
declare function toCubic(ps: number[][]): number[][];
/**
 * Returns the given points (e.g. bezier) in reverse order.
 * @param ps
 */
declare function reverse(ps: number[][]): number[][];
declare function equal(psA: number[][], psB: number[][]): boolean;
export { rotate, getX, getY, getDx, getDy, getDdx, getDdy, getDddx, getDddy, getBounds, bezier3Intersection, bezier3IntersectionSylvester, lineIntersection, tsAtX, tsAtY, getBoundingHull, fromLine, translate, evaluate, κ, dκMod, curvature, tangent, normal, totalCurvature, totalAbsoluteCurvature, length, getTAtLength, evaluateX, evaluateY, evaluateDx, evaluateDy, evaluateDdx, evaluateDdy, evaluateDddx, evaluateDddy, getBoundingBoxTight, getBoundingBox, fromTo, splitAt, scale, quadraticToCubic, toQuadratic, toHybridQuadratic, evaluateHybridQuadratic, evaluateQuadratic, evaluateLinear, coincident, from0ToT, fromTTo1, bezierFromBezierPiece, clone, reverse, equal, deCasteljau, evalDeCasteljau, linearToCubic, toCubic };
export { BezDebug, IDrawFunctions, DebugElemType, FatLine };
export interface BezierPoint {
    p: number[];
    t: number;
}
