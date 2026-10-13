import { simplifyPaths } from 'flo-boolean';
import { getLoopsMetrics } from '../loop/get-max-coordinate.js';
import { simplifyMat } from '../mat/simplify-mat.js';
import { toScaleAxis } from '../sat/to-scale-axis.js';
import { clipOptions } from './clip-options.js';
import { findMat } from './find-mat.js';
import { resetDebugElems } from './get-meta.js';
import { defaultMatOptions } from './mat-options.js';
const { ceil, log2 } = Math;
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
 * @param options the `MatOptions` (see there for a description of each option
 * and its default), e.g. `maxCurviness` and `maxLength` together determine the
 * accuracy of the MAT, `simplify` and `simplifyTolerance` control the
 * simplification of the result and `applySat` and `satScale` whether and how
 * the Scale Axis Transform is applied. Missing options take their defaults
 * (`defaultMatOptions`) and all values are clipped to their allowed ranges.
 */
function findMats(bezierLoops, options) {
    // if (typeof _debug_ !== 'undefined') { var timingStart = performance.now(); }
    resetDebugElems();
    const { maxCoordinate } = getLoopsMetrics(bezierLoops);
    const maxCoordPowerOf2 = ceil(log2(maxCoordinate));
    const options_ = clipOptions(maxCoordPowerOf2, {
        ...defaultMatOptions,
        ...(options || {})
    });
    const { applySat, simplify, satScale, simplifyTolerance } = options_;
    const loopss = simplifyPaths(bezierLoops, {
        forceOrientationNegative: true,
    });
    const mats = [];
    for (const loops of loopss) {
        let mat = findMat(loops, maxCoordPowerOf2, options_);
        if (mat === undefined) {
            continue;
        }
        if (applySat) {
            mat = toScaleAxis(mat, satScale);
        }
        if (simplify) {
            mat = simplifyMat(mat, simplifyTolerance);
        }
        mats.push(mat);
    }
    // console.log(structuredClone(circumCenter.getStats()));
    // circumCenter.resetStats();
    return mats;
}
export { findMats };
//# sourceMappingURL=find-mats.js.map