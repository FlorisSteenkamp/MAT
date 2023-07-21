import { drawFs } from 'flo-draw';
/** @internal */
function dullCorner(g, curve, classes = 'orange', delay = 0, scaleFactor = 1) {
    const ps = curve.ps;
    const p = curve.ps[ps.length - 1];
    const $pos = drawFs.dot(g, p, 0.01 * 0.5 * scaleFactor, classes, delay);
    return $pos;
}
export { dullCorner };
//# sourceMappingURL=dull-corner.js.map