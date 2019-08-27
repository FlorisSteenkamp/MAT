"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const curve_1 = require("../../curve");
function addDebugInfo1(loops) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    for (let loop of loops) {
        _debug_.fs.nameObj(loop, 'l|');
    }
    let generated = _debug_.generated;
    generated.timing.holeClosers[0] = performance.now();
    generated.elems.loop.push(...loops);
    generated.elems.loops.push(loops);
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
            /*
            if (PointOnShape.isSharpCorner(pos)) {
                generated.elems.sharpCorner.push(pos);
            } else if (PointOnShape.isDullCorner(pos)) {
                generated.elems.dullCorner.push(pos);
            }
            */
            let corner = curve_1.Curve.getCornerAtEnd(curve);
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
function addDebugInfo2(pointOnShapeArrPerLoop) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    let generated = _debug_.generated;
    let timing = generated.timing;
    let now = performance.now();
    timing.holeClosers[1] += now - timing.holeClosers[0];
    timing.oneAnd2Prongs[0] = now;
    /*
    for (let pointsOnShape of pointOnShapeArrPerLoop) {
        for (let pos of pointsOnShape) {
            if (PointOnShape.isSharpCorner(pos)) {
                generated.elems.sharpCorner.push(pos);
            } else if (PointOnShape.isDullCorner(pos)) {
                generated.elems.dullCorner.push(pos);
            }
        }
    }
    */
}
exports.addDebugInfo2 = addDebugInfo2;
function addDebugInfo3() {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    let generated = _debug_.generated;
    let timing = generated.timing;
    let now = performance.now();
    timing.oneAnd2Prongs[1] += now - timing.oneAnd2Prongs[0];
    timing.threeProngs[0] = now;
}
exports.addDebugInfo3 = addDebugInfo3;
function addDebugInfo4(mat) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    let generated = _debug_.generated;
    let timing = generated.timing;
    generated.elems.mat.push(mat);
    timing.threeProngs[1] += performance.now() - timing.threeProngs[0];
    timing.mats[1] =
        timing.holeClosers[1] +
            timing.oneAnd2Prongs[1] +
            timing.threeProngs[1];
}
exports.addDebugInfo4 = addDebugInfo4;
//# sourceMappingURL=add-debug-info.js.map