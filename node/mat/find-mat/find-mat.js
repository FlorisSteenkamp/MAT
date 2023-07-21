import { findAndAddAll3Prongs } from './find-3-prong/find-and-add-all-3-prongs.js';
import { createInitialCpGraph } from './create-initial-cp-graph.js';
import { addDebugInfo1, addDebugInfo2, addDebugInfo3, addDebugInfo4 } from './add-debug-info.js';
import { getPotential2Prongs } from './find-2-prong/get-potential-2-prongs.js';
import { getSharpCorners } from './get-sharp-corners.js';
import { findAndAdd2ProngsOnAllPaths } from './find-2-prong/find-and-add-2-prongs-on-all-paths.js';
import { getInterestingPointsOnLoop } from './create-get-interesting-points-on-loop.js';
import { findAndAddHoleClosing2Prongs } from './find-2-prong/find-and-add-hole-closing-2-prongs.js';
/**
 * @internal
 * Find the MAT of the given loops.
 * @param loops The loops (that as a precondition must be ordered from highest
 * (i.e. smallest y-value) topmost point loops to lowest)
 */
function findMat(loops, minBezLength, maxCurviness, maxLength, maxCoordinate) {
    addDebugInfo1(loops);
    // Gets interesting points on the shape, i.e. those that makes sense to use 
    // for the 2-prong procedure.
    const pointsPerLoop = loops.map(getInterestingPointsOnLoop(minBezLength, maxCurviness, maxLength));
    const for2ProngsPerLoop = getPotential2Prongs(pointsPerLoop);
    const sharpCornersPerLoop = getSharpCorners(pointsPerLoop);
    const cpTrees = new Map();
    let cpNode = createInitialCpGraph(loops, cpTrees, sharpCornersPerLoop);
    findAndAddHoleClosing2Prongs(loops, cpTrees, maxCoordinate);
    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterHoleClosers) {
            return undefined;
        }
    }
    addDebugInfo2();
    // for (let pos of for2ProngsPerLoop[0]) {
    //     if (pos.t === 0.9978869234519733) {
    //         console.log(pos)
    //     }
    // }
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
    const mat = { cpNode, cpTrees };
    addDebugInfo4(mat);
    return mat;
}
export { findMat };
//# sourceMappingURL=find-mat.js.map