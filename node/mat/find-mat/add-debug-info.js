import { getBoundingHull, getBoundingBoxTight } from 'flo-bezier3';
import { getCornerAtEnd } from '../../curve.js';
import { getBoundingBox_ } from '../../get-bounding-box-.js';
let timingStart;
/** @internal */
function addDebugInfo1(loops) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    timingStart = performance.now();
    for (const loop of loops) {
        _debug_.fs.nameObj(loop, 'l|');
    }
    const generated = _debug_.generated;
    //generated.elems.loop.push(...loops);
    //generated.elems.loops.push(loops);
    for (const loop of loops) {
        let i = 0;
        loop.curves.forEach(function (curve) {
            const ps = curve.ps;
            const hull = getBoundingHull(ps);
            generated.elems.boundingHull.push(hull);
            const looseBoundingBox = getBoundingBox_(ps);
            generated.elems.looseBoundingBox.push(looseBoundingBox);
            const tightBoundingBox = getBoundingBoxTight(ps);
            generated.elems.tightBoundingBox.push(tightBoundingBox);
            const corner = getCornerAtEnd(curve);
            if (corner.isSharp) {
                generated.elems.sharpCorner.push(curve);
            }
            else if (corner.isDull) {
                generated.elems.dullCorner.push(curve);
            }
            i++;
        });
    }
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
function addDebugInfo4(mat) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    const generated = _debug_.generated;
    const timing = generated.timing;
    generated.elems.mat.push(mat);
    timing.threeProngs += performance.now() - timingStart;
}
export { addDebugInfo1, addDebugInfo2, addDebugInfo3, addDebugInfo4 };
//# sourceMappingURL=add-debug-info.js.map