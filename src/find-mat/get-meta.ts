import { getBoundingHull, getBoundingBoxTight } from 'flo-bezier3';
import { Debug }   from '../debug/debug.js';
import { Loop } from 'flo-boolean';
import { Curve } from '../curve/curve.js';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';
import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from '../cp-node/cp-node.js';
import { TriMap, TriMapFs } from '../utils/tri-map.js';
import { MatMeta } from '../mat/mat-meta.js';
import { getCorner } from '../corner/get-corner.js';


/** @internal */
declare const _debug_: Debug; 


let timingStart: number;


/** @internal */
function getMeta(
        maxCoordinate: number,
        squaredDiagonalLength: number,
        loops: Loop[],
        cpTrees: Map<Loop, LlRbTree<CpNode>>): MatMeta {

    timingStart = performance.now();

    const pointToCpNode: TriMap<Loop,number,number,CpNode> = new Map();

    const looseBoundingBoxes: number[][][] = [];
    const tightBoundingBoxes: number[][][] = [];
    const boundingHulls: number[][][] = [];
    const sharpCorners: Curve[] = [];
    const dullCorners: Curve[] = [];

    for (const loop of loops) {
        // Populate `posMap`
        const cpTree = cpTrees.get(loop)!;
        const cpNodes = cpTree.toArrayInOrder();
        for (const cpNode of cpNodes) {
            const { p, t } = cpNode.cp.pointOnShape;
            TriMapFs.set(pointToCpNode,loop,p[0],p[1],cpNode);
        }

        for (let curve of loop.curves) {
            const ps = curve.ps;
            const hull = getBoundingHull(ps, true)!;

            boundingHulls.push(hull);

            const looseBoundingBox = getBoundingBox$(ps);
            looseBoundingBoxes.push(looseBoundingBox);

            const tightBoundingBox = getBoundingBoxTight(ps);
            tightBoundingBoxes.push(tightBoundingBox);

            const corner = getCorner(curve.ps, curve.next.ps);
            if (corner.isQuiteSharp) {
                sharpCorners.push(curve);
            } else if (corner.isQuiteDull) {
                dullCorners.push(curve);
            }
        }
    }

    return {
        maxCoordinate,
        squaredDiagonalLength,
        looseBoundingBoxes,
        tightBoundingBoxes,
        boundingHulls,
        sharpCorners,
        dullCorners,
        loops,
        cpTrees,
        pointToCpNode
    }
}


/** @internal */
function addDebugInfo2() {
    if (typeof _debug_ === 'undefined') { return; }

    const timing = _debug_.generated.timing;
    const now = performance.now();
    timing.holeClosers += now - timingStart;
    timingStart = now;
}


function addDebugInfo3() {
    if (typeof _debug_ === 'undefined') { return; }

    const generated = _debug_.generated;
    const timing = generated.timing;
    const now = performance.now();

    timing.oneAnd2Prongs += now - timingStart;
    timingStart = now;
}


function addDebugInfo4() {
    if (typeof _debug_ === 'undefined') { return; }

    const generated = _debug_.generated;
    const timing = generated.timing;

    timing.threeProngs += performance.now() - timingStart;
}


export { getMeta, addDebugInfo2, addDebugInfo3, addDebugInfo4 }
