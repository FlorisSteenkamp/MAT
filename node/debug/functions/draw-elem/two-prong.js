import { drawFs } from 'flo-draw';
import { getTwoProngType } from '../../../mat/get-two-prong-type.js';
/** @hidden */
function twoProng(g, twoProng) {
    let scaleFactor = 0.3;
    let $failedDot = [];
    let $center = [];
    let $circle = [];
    let $cp1 = [];
    let $cp2 = [];
    let color;
    let thin;
    switch (getTwoProngType(twoProng)) {
        case 'twoProng_regular': {
            color = 'red ';
            thin = '2';
            break;
        }
        case 'twoProng_holeClosing': {
            color = 'cyan ';
            thin = '10';
            break;
        }
    }
    if (twoProng.failed) {
        $failedDot = drawFs.dot(g, twoProng.pos.p, 1 * scaleFactor, 'black');
    }
    else if (!twoProng.failed) {
        $center = drawFs.dot(g, twoProng.circle.center, 1 * scaleFactor, 'yellow');
        $circle = drawFs.circle(g, twoProng.circle, color + 'thin' + thin + ' nofill');
        $cp1 = drawFs.dot(g, twoProng.pos.p, 0.035 * scaleFactor, color);
        $cp2 = drawFs.dot(g, twoProng.z, 0.07 * scaleFactor, color);
    }
    return [...$failedDot, ...$center, ...$circle, ...$cp1, ...$cp2];
}
export { twoProng };
//# sourceMappingURL=two-prong.js.map