import { getBoundingHull } from 'flo-bezier3';
import { getBoundingBox$, getBoundingBoxTight$ } from '../geometry/get-bounding-box-.js';
import { getCorner } from '../corner/get-corner.js';
import { createEmptyElems } from '../debug/debug.js';
let timingStart;
/**
 * @internal
 * Resets the generated debug `_debug_.elems` (if debug is enabled) so that
 * they only reflect the current `findMats` call.
 */
function resetDebugElems() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    _debug_.elems = { ..._debug_.elems, ...createEmptyElems() };
}
/**
 * @internal
 * Adds (if debug is enabled) the loose and tight bounding boxes, the bounding
 * hulls and the sharp and dull corners of the given loops' curves to
 * `_debug_.elems` for later inspection by consumers.
 */
function addDebugElems(loops) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    const { looseBoundingBoxes, tightBoundingBoxes, boundingHulls, sharpCorners, dullCorners } = _debug_.elems;
    for (const loop of loops) {
        for (const curve of loop.curves) {
            const ps = curve.ps;
            boundingHulls.push(getBoundingHull(ps, true));
            looseBoundingBoxes.push(getBoundingBox$(ps));
            tightBoundingBoxes.push(getBoundingBoxTight$(ps));
            const corner = getCorner(ps, curve.next.ps);
            if (corner.isQuiteSharp) {
                sharpCorners.push(curve);
            }
            else if (corner.isQuiteDull) {
                dullCorners.push(curve);
            }
        }
    }
}
function addDebugInfo1() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    timingStart = performance.now();
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
/** @internal */
function addDebugInfo3() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    const now = performance.now();
    _debug_.timing.oneAnd2Prongs += now - timingStart;
    timingStart = now;
}
/** @internal */
function addDebugInfo4() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    _debug_.timing.threeProngs += performance.now() - timingStart;
}
export { resetDebugElems, addDebugElems, addDebugInfo1, addDebugInfo2, addDebugInfo3, addDebugInfo4 };
//# sourceMappingURL=get-meta.js.map