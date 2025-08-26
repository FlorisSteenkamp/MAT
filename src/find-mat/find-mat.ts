/** @internal */
declare const _debug_: Debug; 

import { LlRbTree } from 'flo-ll-rb-tree';
import { Debug } from '../debug/debug.js';
import { CpNode } from '../cp-node/cp-node.js';
import { Loop } from 'flo-boolean';
import { findAndAdd3ProngsOnLoop } from '../find-3-prong.ts/find-and-add-3-prongs-on-loop.js';
import { createInitialCpTree } from './create-initial-cp-tree.js';
import { getMeta, addDebugInfo2, addDebugInfo3, addDebugInfo4 } from './get-meta.js';
import { getSharpCornersOnLoop } from './get-sharp-corners.js';
import { getDullCornersOnLoop } from './get-dull-corners-on-loop.js';
import { findAndAdd2ProngsOnAllLoops } from '../find-2-prong/find-and-add-2-prongs-on-all-loops.js';
import { getFor2ProngsOnLoop } from './get-for-2-prongs-on-loop.js';
import { getFor1ProngsOnLoop } from './get-for-1-prongs-on-loop.js';
import { findAndAddHoleClosing2Prongs } from '../find-2-prong/find-and-add-hole-closing-2-prongs.js';
import { getShapeBounds } from '../svg/get-shape-bounds.js';
import { MatOptions } from './mat-options.js';


/**
 * @internal
 * Find the MAT of the given loops.
 * @param loops The loops (that as a precondition must be ordered from highest 
 * (i.e. smallest y-value) topmost point loops to lowest)
 */
function findMat(
        loops: Loop[], 
        maxCoordinate: number,
        options: Required<MatOptions>) {

    const { minBezLength, maxCurviness, maxLength, angleIncrement } = options;

    const getSharpCornersOnLoop_ = getSharpCornersOnLoop(minBezLength);
    const getDullCornersOnLoop_ = getDullCornersOnLoop(minBezLength);
    const getFor2ProngsOnLoop_ = getFor2ProngsOnLoop(minBezLength, maxCurviness, maxLength);
    const getFor1ProngsOnLoop_ = getFor1ProngsOnLoop(minBezLength);

    const sharpCornersPerLoop = loops.map(getSharpCornersOnLoop_);

    const cpTrees: Map<Loop, LlRbTree<CpNode>> = new Map();
    createInitialCpTree(loops, cpTrees, sharpCornersPerLoop);

    const bounds = getShapeBounds(loops);
    const squaredDiagonalLength = 
        (bounds.maxX.p[0] - bounds.minX.p[0])**2 +
        (bounds.maxY.p[1] - bounds.minY.p[1])**2;

    const meta = getMeta(maxCoordinate, squaredDiagonalLength, loops, cpTrees);

    let cpNode: CpNode | undefined;

    cpNode = findAndAddHoleClosing2Prongs(meta);

    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterHoleClosers) { return { cpNode: cpNode!, meta }; }
    }
    addDebugInfo2();

    const dullCornersPerLoop = loops.map(getDullCornersOnLoop_);
    cpNode = findAndAdd2ProngsOnAllLoops(meta, angleIncrement, dullCornersPerLoop, false) || cpNode;

    const for1ProngsPerLoop = loops.map(getFor1ProngsOnLoop_);
    cpNode = findAndAdd2ProngsOnAllLoops(meta, angleIncrement, for1ProngsPerLoop, true) || cpNode;

    const for2ProngsPerLoop = loops.map(getFor2ProngsOnLoop_);
    cpNode = findAndAdd2ProngsOnAllLoops(meta, angleIncrement, for2ProngsPerLoop, false) || cpNode;

    addDebugInfo3();

    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterTwoProngs) { return { cpNode: cpNode!, meta }; }
    }

    cpNode = findAndAdd3ProngsOnLoop(meta, cpNode);

    if (cpNode === undefined) { return undefined!; }

    if (typeof _debug_ !== 'undefined') {
        if (_debug_.directives.stopAfterThreeProngs) { return { cpNode: cpNode!, meta }; }
    }

    // if (cpNode !== undefined) { add2rongsByError(options, 0.1, meta, cpNode); }

    // if (cpNode !== undefined) { checkOrdering(cpTrees, cpNode); }

    const mat = { cpNode, meta };

    addDebugInfo4();

    return mat;
}


export { findMat }



/** Curvilinear Shape Features (CSFs) */
// const csfs = getCsfs(meta, minBezLength, loops);
// const ligatures = getLigatures(meta, csfs);