"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDebugInfo4 = exports.addDebugInfo3 = exports.addDebugInfo2 = exports.addDebugInfo1 = void 0;
const flo_bezier3_1 = require("flo-bezier3");
const curve_1 = require("../../curve");
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
            let hull = flo_bezier3_1.getBoundingHull(ps);
            generated.elems.boundingHull.push(hull);
            let looseBoundingBox = flo_bezier3_1.getBoundingBox(ps);
            generated.elems.looseBoundingBox.push(looseBoundingBox);
            let tightBoundingBox = flo_bezier3_1.getBoundingBoxTight(ps);
            generated.elems.tightBoundingBox.push(tightBoundingBox);
            let corner = curve_1.getCornerAtEnd(curve);
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
exports.addDebugInfo1 = addDebugInfo1;
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
exports.addDebugInfo2 = addDebugInfo2;
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
exports.addDebugInfo3 = addDebugInfo3;
function addDebugInfo4(mat) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    let generated = _debug_.generated;
    let timing = generated.timing;
    generated.elems.mat.push(mat);
    timing.threeProngs += performance.now() - timingStart;
}
exports.addDebugInfo4 = addDebugInfo4;
//# sourceMappingURL=add-debug-info.js.map