import { drawFs } from 'flo-draw';
/** @internal */
function sharpCorner(g, curve, classes = 'green', delay = 0, scaleFactor = 1) {
    const p = curve.ps[curve.ps.length - 1];
    const $pos = drawFs.dot(g, p, 0.6 * scaleFactor, 'green', delay);
    return $pos;
}
export { sharpCorner };
//# sourceMappingURL=draw-sharp-corner.js.map