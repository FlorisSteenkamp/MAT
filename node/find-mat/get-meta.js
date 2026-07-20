import { getBoundingHull, getBoundingBoxTight } from 'flo-bezier3';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';
import { getCorner } from '../corner/get-corner.js';
let timingStart;
/** @internal */
function getPartialMeta(loops) {
    const looseBoundingBoxes = [];
    const tightBoundingBoxes = [];
    const boundingHulls = [];
    const sharpCorners = [];
    const dullCorners = [];
    for (const loop of loops) {
        for (const curve of loop.curves) {
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
        looseBoundingBoxes,
        tightBoundingBoxes,
        boundingHulls,
        sharpCorners,
        dullCorners
    };
}
/** @internal */
function addDebugInfo2() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    const now = performance.now();
    _debug_.timing.holeClosers += now - timingStart;
    timingStart = now;
}
function addDebugInfo3() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    const now = performance.now();
    _debug_.timing.oneAnd2Prongs += now - timingStart;
    timingStart = now;
}
function addDebugInfo4() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    _debug_.timing.threeProngs += performance.now() - timingStart;
}
export { getPartialMeta, addDebugInfo2, addDebugInfo3, addDebugInfo4 };
//# sourceMappingURL=get-meta.js.map