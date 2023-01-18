import { drawFs } from 'flo-draw';
/** @hidden */
function sharpCorner(g, curve) {
    const scaleFactor = 1;
    const p = curve.ps[curve.ps.length - 1];
    const $pos = drawFs.dot(g, p, 0.6 * scaleFactor, 'green');
    return $pos;
}
export { sharpCorner };
//# sourceMappingURL=sharp-corner.js.map