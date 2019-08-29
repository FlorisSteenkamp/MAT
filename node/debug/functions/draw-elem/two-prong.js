"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_two_prong_type_1 = require("../../../mat/get-two-prong-type");
const flo_draw_1 = require("flo-draw");
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
    switch (get_two_prong_type_1.getTwoProngType(twoProng)) {
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
        $failedDot = flo_draw_1.drawFs.dot(g, twoProng.pos.p, 1 * scaleFactor, 'black');
    }
    else if (!twoProng.failed) {
        $center = flo_draw_1.drawFs.dot(g, twoProng.circle.center, 1 * scaleFactor, 'yellow');
        $circle = flo_draw_1.drawFs.circle(g, twoProng.circle, color + 'thin' + thin + ' nofill');
        $cp1 = flo_draw_1.drawFs.dot(g, twoProng.pos.p, 0.035 * scaleFactor, color);
        $cp2 = flo_draw_1.drawFs.dot(g, twoProng.z, 0.07 * scaleFactor, color);
    }
    return [...$failedDot, ...$center, ...$circle, ...$cp1, ...$cp2];
}
exports.twoProng = twoProng;
//# sourceMappingURL=two-prong.js.map