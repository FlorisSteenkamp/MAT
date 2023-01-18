import { drawFs } from 'flo-draw';
/** @hidden */
function dullCorner(g, curve) {
    const scaleFactor = 1;
    const ps = curve.ps;
    const p = curve.ps[ps.length - 1];
    const $pos = drawFs.dot(g, p, 0.5 * scaleFactor, 'orange');
    return $pos;
}
export { dullCorner };
//# sourceMappingURL=dull-corner.js.map