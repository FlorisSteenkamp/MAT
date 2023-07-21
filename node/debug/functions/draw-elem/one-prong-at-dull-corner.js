import { drawFs } from 'flo-draw';
import { getOsculatingCircle } from '../../../point-on-shape/get-osculating-circle.js';
/** @internal */
function oneProngAtDullCorner(g, pos, classes, delay = 0, scaleFactor = 1) {
    //let oCircle = PointOnShape.getOsculatingCircle(Number.POSITIVE_INFINITY, pos);
    const oCircle = getOsculatingCircle(Number.POSITIVE_INFINITY, pos);
    const $center = drawFs.dot(g, pos.p, 0.1, 'orange', delay);
    const $circle = drawFs.dot(g, oCircle.center, 0.25, 'orange', delay);
    const $pos = drawFs.circle(g, oCircle, 'orange thin10 nofill', delay);
    return [...$center, ...$circle, ...$pos];
}
export { oneProngAtDullCorner };
//# sourceMappingURL=one-prong-at-dull-corner.js.map