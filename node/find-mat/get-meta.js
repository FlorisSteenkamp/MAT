import { getBoundingHull, getBoundingBoxTight } from 'flo-bezier3';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';
import { TriMapFs } from '../utils/tri-map.js';
import { getCorner } from '../corner/get-corner.js';
let timingStart;
/** @internal */
function getMeta(maxCoordinate, squaredDiagonalLength, loops, cpTrees) {
    timingStart = performance.now();
    const pointToCpNode = new Map();
    const looseBoundingBoxes = [];
    const tightBoundingBoxes = [];
    const boundingHulls = [];
    const sharpCorners = [];
    const dullCorners = [];
    for (const loop of loops) {
        // Populate `posMap`
        const cpTree = cpTrees.get(loop);
        const cpNodes = cpTree.toArrayInOrder();
        for (const cpNode of cpNodes) {
            const { p, t } = cpNode.cp.pointOnShape;
            TriMapFs.set(pointToCpNode, loop, p[0], p[1], cpNode);
        }
        for (let curve of loop.curves) {
            const ps = curve.ps;
            const hull = getBoundingHull(ps, true);
            boundingHulls.push(hull);
            const looseBoundingBox = getBoundingBox$(ps);
            looseBoundingBoxes.push(looseBoundingBox);
            const tightBoundingBox = getBoundingBoxTight(ps);
            tightBoundingBoxes.push(tightBoundingBox);
            const corner = getCorner(curve.ps, curve.next.ps);
            if (corner.isQuiteSharp) {
                sharpCorners.push(curve);
            }
            else if (corner.isQuiteDull) {
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
    };
}
/** @internal */
function addDebugInfo2() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    const timing = _debug_.generated.timing;
    const now = performance.now();
    timing.holeClosers += now - timingStart;
    timingStart = now;
}
function addDebugInfo3() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    const generated = _debug_.generated;
    const timing = generated.timing;
    const now = performance.now();
    timing.oneAnd2Prongs += now - timingStart;
    timingStart = now;
}
function addDebugInfo4() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    const generated = _debug_.generated;
    const timing = generated.timing;
    timing.threeProngs += performance.now() - timingStart;
}
export { getMeta, addDebugInfo2, addDebugInfo3, addDebugInfo4 };
//# sourceMappingURL=get-meta.js.map