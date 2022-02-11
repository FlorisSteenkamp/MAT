import { drawFs } from 'flo-draw';
/** @hidden */
function dullCorner(g, curve) {
    const scaleFactor = 1;
    let ps = curve.ps;
    let p = curve.ps[ps.length - 1];
    let $pos = drawFs.dot(g, p, 0.5 * scaleFactor, 'orange');
    return $pos;
}
export { dullCorner };
//# sourceMappingURL=dull-corner.js.map