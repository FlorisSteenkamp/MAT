import { beziersToSvgPathStr, simplifyPaths } from 'flo-boolean';
import { findMat } from './find-mat.js';
import { getSizeParams } from './get-size-params.js';
/**
 * Finds and returns the Medial Axis Transforms (MATs) from the given array of
 * bezier loops representing shape boundaries.
 *
 * @param bezierLoops An array of (possibly intersecting) loops with each loop
 * representing one or more piecewise smooth closed curves (i.e. shapes). Each
 * loop consists of an array of beziers represented by an array of control
 * points with 2,3 or 4 elements corresponding to linear, quadratic and cubic
 * beziers respectively. Each point is a two-element array (ordered pair), the
 * first of which is the x-coordinate and the second the y-coordinate.
 *
 * @param maxCurviness The maximum value the 'curviness' of a curve can have
 * before an additional MAT point is inserted in between. Defaults to 0.4.
 * (Curviness is measured as the total angle in radians between the consecutive
 * vectors formed by the ordered control points of th bezier curve). The value
 * is clipped in the range `[0.05,3]`.
 * @param maxLength The maximum length a curve can have before an additional MAT
 * point is inserted. This value is scaled to a reference 1024 x 1024
 * grid (e.g. if the shape fits in a 512 x 512 axis-aligned box the value will be
 * halved, e.g. from 10 to 5). Together with maxCurviness it represents a
 * tolerance for the accuracy of the MAT. Defaults to 4. The value is clipped
 * in [1,100].
 */
function findMats(bezierLoops, maxCurviness = 0.4, maxLength = 4) {
    // if (typeof _debug_ !== 'undefined') { var timingStart = performance.now(); }
    let maxCoordinate;
    let minBezLength;
    ({ maxCurviness, maxLength, maxCoordinate, minBezLength } =
        getSizeParams(bezierLoops, maxCurviness, maxLength));
    const loopss = simplifyPaths(bezierLoops, maxCoordinate);
    // console.log(loopsToSvgPathStr(bezierLoops.map(v => v.map(v => v.map(v => v.map(v => v*2**1))))));
    // console.log(loopsToSvgPathStr(loopss[0].map(loop => loop.beziers)));
    const mats = [];
    for (const loops of loopss) {
        const mat = findMat(loops, minBezLength, maxCurviness, maxLength, maxCoordinate);
        if (mat) {
            mats.push(mat);
        }
    }
    return mats;
}
/**
 * Returns an SVG path string representation of the given bezier loops.
 * @param loops An array of loops having an array of bezier curves each given as
 * an array of control points.
 */
function loopsToSvgPathStr(loops) {
    let str = '';
    for (const loop of loops) {
        str = str + beziersToSvgPathStr(loop) + '\n';
    }
    return str;
}
export { findMats };
//# sourceMappingURL=find-mats.js.map