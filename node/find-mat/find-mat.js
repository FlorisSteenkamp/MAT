import { findAndAddAll3Prongs } from '../find-3-prong.ts/find-and-add-all-3-prongs.js';
import { createInitialCpGraph } from './create-initial-cp-graph.js';
import { addDebugInfo1, addDebugInfo2, addDebugInfo3, addDebugInfo4 } from './add-debug-info.js';
import { getSharpCornersOnLoop } from './get-sharp-corners.js';
import { getDullCornersOnLoop } from './get-dull-corners.js';
import { findAndAdd2ProngsOnAllPaths } from '../find-2-prong/find-and-add-2-prongs-on-all-paths.js';
import { getFor2ProngsOnLoop } from './get-for-2-prongs-on-loop.js';
import { getFor1ProngsOnLoop } from './get-for-1-prongs-on-loop.js';
import { findAndAddHoleClosing2Prongs } from '../find-2-prong/find-and-add-hole-closing-2-prongs.js';
/**
 * @internal
 * Find the MAT of the given loops.
 * @param loops The loops (that as a precondition must be ordered from highest
 * (i.e. smallest y-value) topmost point loops to lowest)
 */
function findMat(loops, minBezLength, maxCurviness, maxLength, maxCoordinate) {
    addDebugInfo1(loops);
    const getSharpCornersOnLoop_ = getSharpCornersOnLoop(minBezLength);
    const getDullCornersOnLoop_ = getDullCornersOnLoop(minBezLength);
    const sharpCornersPerLoop = loops.map(getSharpCornersOnLoop_);
    const dullCornersPerLoop = loops.map(getDullCornersOnLoop_);
    const cpTrees = new Map();
    createInitialCpGraph(loops, cpTrees, sharpCornersPerLoop);
    findAndAddHoleClosing2Prongs(loops, cpTrees, maxCoordinate);
    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterHoleClosers) {
            return undefined;
        }
    }
    addDebugInfo2();
    const for1ProngsPerLoop = loops.map(getFor1ProngsOnLoop(minBezLength));
    const for2ProngsPerLoop = loops.map(getFor2ProngsOnLoop(minBezLength, maxCurviness, maxLength));
    let cpNode;
    cpNode = findAndAdd2ProngsOnAllPaths(cpNode, loops, cpTrees, dullCornersPerLoop, maxCoordinate, false);
    cpNode = findAndAdd2ProngsOnAllPaths(cpNode, loops, cpTrees, for1ProngsPerLoop, maxCoordinate, true);
    cpNode = findAndAdd2ProngsOnAllPaths(cpNode, loops, cpTrees, for2ProngsPerLoop, maxCoordinate, false);
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