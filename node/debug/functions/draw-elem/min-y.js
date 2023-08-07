import { evalDeCasteljau } from 'flo-bezier3';
import { drawFs } from 'flo-draw';
/** @internal */
function minY(g, pos) {
    const p = evalDeCasteljau(pos.curve.ps, pos.t);
    const $elems = drawFs.crossHair(g, p, 'red thin10 nofill');
    return $elems;
}
export { minY };
//# sourceMappingURL=min-y.js.map