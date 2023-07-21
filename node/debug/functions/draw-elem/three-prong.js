import { drawFs } from 'flo-draw';
import { scaleCircle } from '../../../circle.js';
/** @internal */
function threeProng(g, threeProng, classes, delay = 0, scaleFactor = 1) {
    const circle = scaleCircle(threeProng.circle, 1);
    const poss = threeProng.poss;
    const $cp1 = drawFs.dot(g, poss[0].p, 0.01 * 1 * scaleFactor, 'blue', delay);
    const $cp2 = drawFs.dot(g, poss[1].p, 0.01 * 2 * scaleFactor, 'blue', delay);
    const $cp3 = drawFs.dot(g, poss[2].p, 0.01 * 3 * scaleFactor, 'blue', delay);
    const $center = drawFs.dot(g, circle.center, 0.03 * scaleFactor, 'blue', delay);
    const $circle = drawFs.circle(g, circle, 'blue thin2 nofill', delay);
    return [...$center, ...$cp1, ...$cp2, ...$cp3, ...$circle];
}
export { threeProng };
//# sourceMappingURL=three-prong.js.map