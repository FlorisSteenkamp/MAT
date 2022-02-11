import { getBoundingHull, getBoundingBoxTight } from 'flo-bezier3';
import { getCornerAtEnd } from '../../curve.js';
import { getBoundingBox_ } from '../../get-bounding-box-.js';
if (typeof _debug_ !== 'undefined') {
    var timingStart;
}
/** @hidden */
function addDebugInfo1(loops) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    timingStart = performance.now();
    for (let loop of loops) {
        _debug_.fs.nameObj(loop, 'l|');
    }
    let generated = _debug_.generated;
    //generated.elems.loop.push(...loops);
    //generated.elems.loops.push(loops);
    for (let loop of loops) {
        let i = 0;
        loop.curves.forEach(function (curve) {
            let ps = curve.ps;
            let hull = getBoundingHull(ps);
            generated.elems.boundingHull.push(hull);
            let looseBoundingBox = getBoundingBox_(ps);
            generated.elems.looseBoundingBox.push(looseBoundingBox);
            let tightBoundingBox = getBoundingBoxTight(ps);
            generated.elems.tightBoundingBox.push(tightBoundingBox);
            let corner = getCornerAtEnd(curve);
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
/** @hidden */
function addDebugInfo2() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    let timing = _debug_.generated.timing;
    let now = performance.now();
    timing.holeClosers += now - timingStart;
    timingStart = now;
}
function addDebugInfo3() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    let generated = _debug_.generated;
    let timing = generated.timing;
    let now = performance.now();
    timing.oneAnd2Prongs += now - timingStart;
    timingStart = now;
}
function addDebugInfo4(mat) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    let generated = _debug_.generated;
    let timing = generated.timing;
    generated.elems.mat.push(mat);
    timing.threeProngs += performance.now() - timingStart;
}
export { addDebugInfo1, addDebugInfo2, addDebugInfo3, addDebugInfo4 };
//# sourceMappingURL=add-debug-info.js.map