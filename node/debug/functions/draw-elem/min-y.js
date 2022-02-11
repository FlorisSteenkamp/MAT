import { toCubic, evalDeCasteljau } from 'flo-bezier3';
import { drawFs } from 'flo-draw';
/** @hidden */
function minY(g, pos) {
    let p = evalDeCasteljau(pos.curve.ps, pos.t);
    let ps = toCubic(pos.curve.ps);
    //console.log('x: ', getX(ps));
    //console.log('y: ', getY(ps));
    //console.log('t: ', pos.t);
    let $elems = drawFs.crossHair(g, p, 'red thin10 nofill');
    return $elems;
}
export { minY };
//# sourceMappingURL=min-y.js.map