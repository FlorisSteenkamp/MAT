import { drawFs } from 'flo-draw';
import { getOsculatingCircle } from '../../../point-on-shape.js';
/** @hidden */
function oneProngAtDullCorner(g, pos) {
    //let oCircle = PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos);
    const oCircle = getOsculatingCircle(Number.POSITIVE_INFINITY, pos);
    const $center = drawFs.dot(g, pos.p, 0.1, 'orange');
    const $circle = drawFs.dot(g, oCircle.center, 0.25, 'orange');
    const $pos = drawFs.circle(g, oCircle, 'orange thin10 nofill');
    return [...$center, ...$circle, ...$pos];
}
export { oneProngAtDullCorner };
//# sourceMappingURL=one-prong-at-dull-corner.js.map