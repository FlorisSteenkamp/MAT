import { simplifyPaths } from 'flo-boolean';
import { findAndAddAll3Prongs } from './mat/find-mat/find-and-add-3-prongs.js';
import { createInitialCpGraph } from './mat/find-mat/create-initial-cp-graph.js';
;
import { addDebugInfo1, addDebugInfo2, addDebugInfo3, addDebugInfo4 } from './mat/find-mat/add-debug-info.js';
import { getPotential2Prongs } from './mat/find-mat/get-potential-2-prongs.js';
import { getSharpCorners } from './mat/find-mat/get-sharp-corners.js';
import { findAndAdd2ProngsOnAllPaths } from './mat/find-mat/find-and-add-2-prongs-on-all-paths.js';
import { getInterestingPointsOnLoop } from './mat/find-mat/create-get-interesting-points-on-loop.js';
import { findAndAddHoleClosing2Prongs } from './mat/find-mat/find-and-add-hole-closing-2-prongs.js';
import { getLoopsMetrics } from './loop/get-max-coordinate.js';
/**
 * Finds and returns the Medial Axis Transforms (MATs) from the given array of
 * bezier loops representing shape boundaries.
 * @param bezierLoops An array of (possibly intersecting) loops with each loop
 * representing one or more piecewise smooth closed curves (i.e. shapes). Each
 * loop consists of an array of beziers represented by an array of control
 * points with 2,3 or 4 elements corresponding to linear, quadratic and cubic
 * beziers respectively. Each point is a two-element array (ordered pair), the
 * first of which is the x-coordinate and the second the y-coordinate.
 * @param maxFlatness The maximum value the flatness of a curve can have before
 * an additional MAT point is added in between. Defaults to 1.01. (Flatness is
 * measured as the total distance between control points of a curve divided by
 * the length of the curve.) The is clipped in [1.001,2]..
 * @param maxLength The maximum length a curve can have before an additional MAT
 * point is added in between. This value is scaled to a reference 1024 x 1024
 * grid (e.g. if the shape fits in a 512 x 512 axis-aligned box the will be
 * halved, e.g. from 10 to 5). Together with maxFlatness it represents a
 * tolerance for the accuracy of the MAT. Defaults to 4. The value is clipped
 * in [1,100].
 */
function findMats(bezierLoops, maxFlatness = 1.01, maxLength = 4) {
    if (typeof _debug_ !== 'undefined') {
        var timingStart = performance.now();
    }
    let maxCoordinate;
    let minBezLength;
    ({ maxFlatness, maxLength, maxCoordinate, minBezLength } =
        getSizeParams(bezierLoops, maxFlatness, maxLength));
    let loopss = simplifyPaths(bezierLoops, maxCoordinate);
    let mats = [];
    for (let loops of loopss) {
        let mat = findMat(loops, minBezLength, maxFlatness, maxLength, maxCoordinate);
        if (mat) {
            mats.push(mat);
        }
    }
    return mats;
}
function getSizeParams(bezierLoops, maxFlatness, maxLength) {
    // Gather some shape metrics
    let { maxCoordinate, maxRadius } = getLoopsMetrics(bezierLoops);
    let expMax = Math.ceil(Math.log2(maxCoordinate));
    let minBezLengthSigBits = 14;
    /**
     * If a curve is shorter than this value then no points on it will be
     * selected for the purpose of finding the MAT.
     */
    let minBezLength = 2 ** expMax * 2 ** (-minBezLengthSigBits);
    // Limit the tolerance to a reasonable level
    if (maxFlatness < 1.001) {
        maxFlatness = 1.001;
    }
    if (maxFlatness > 2) {
        maxFlatness = 2;
    }
    // Limit the tolerance to a reasonable level
    if (maxLength < 0.1) {
        maxLength = 0.1;
    }
    if (maxLength > 100) {
        maxLength = 100;
    }
    // Adjust length tolerance according to a reference max coordinate
    let expMaxRadius = Math.ceil(Math.log2(maxRadius));
    let maxLengthSigBits = 10; // 1024 x 1024
    maxLength = maxLength * (2 ** expMaxRadius * 2 ** (-maxLengthSigBits));
    return { maxFlatness, maxLength, maxCoordinate, minBezLength };
}
/**
 * @hidden
 * Find the MAT of the given loops.
 * @param loops The loops (that as a precondition must be ordered from highest
 * (i.e. smallest y-value) topmost point loops to lowest)
 * @param xMap Intersection point map.
 * @param additionalPointCount
 */
function findMat(loops, minBezLength, maxFlatness, maxLength, maxCoordinate) {
    addDebugInfo1(loops);
    // Gets interesting points on the shape, i.e. those that makes sense to use 
    // for the 2-prong procedure.
    let pointsPerLoop = loops.map(getInterestingPointsOnLoop(minBezLength, maxFlatness, maxLength));
    let for2ProngsPerLoop = getPotential2Prongs(pointsPerLoop);
    let sharpCornersPerLoop = getSharpCorners(pointsPerLoop);
    let cpTrees = new Map();
    let cpNode = createInitialCpGraph(loops, cpTrees, sharpCornersPerLoop);
    findAndAddHoleClosing2Prongs(loops, cpTrees, maxCoordinate);
    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterHoleClosers) {
            return undefined;
        }
    }
    addDebugInfo2();
    cpNode = findAndAdd2ProngsOnAllPaths(loops, cpTrees, for2ProngsPerLoop, maxCoordinate);
    addDebugInfo3();
    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterTwoProngs) {
            return undefined;
        }
    }
    if (cpNode === undefined) {
        return undefined;
    }
    findAndAddAll3Prongs(cpTrees, cpNode, maxCoordinate);
    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterThreeProngs) {
            return undefined;
        }
    }
    let mat = { cpNode, cpTrees };
    addDebugInfo4(mat);
    return mat;
}
export { findMats };
//# sourceMappingURL=find-mats.js.map