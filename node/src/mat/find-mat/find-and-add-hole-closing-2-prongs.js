"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svg_1 = require("../../svg/svg");
const find_2_prong_1 = require("./find-2-prong/find-2-prong");
const add_2_prong_1 = require("./add-2-prong");
/**
 * Find and add two-prongs that remove any holes in the shape.
 * @param loops
 * @param cpTrees
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAddHoleClosing2Prongs(loops, cpTrees, extreme) {
    let bounds = svg_1.getShapeBounds(loops);
    let squaredDiagonalLength = Math.pow((bounds.maxX.p[0] - bounds.minX.p[0]), 2) +
        Math.pow((bounds.maxY.p[1] - bounds.minY.p[1]), 2);
    // Find the topmost points on each loop.
    let minYs = loops.map(svg_1.getMinYPos);
    for (let k = 1; k < minYs.length; k++) {
        let posSource = minYs[k];
        //console.log(posSource.t);
        //console.log(posSource.p[1]);
        let holeClosingTwoProng = find_2_prong_1.find2Prong(loops, extreme, squaredDiagonalLength, cpTrees, posSource, true, k);
        if (!holeClosingTwoProng) {
            throw 'unable to find hole-closing 2-prong';
        }
        if (holeClosingTwoProng) {
            let { circle, z: posAntipode } = holeClosingTwoProng;
            add_2_prong_1.add2Prong(cpTrees, circle, posSource, posAntipode, true, extreme);
        }
    }
}
exports.findAndAddHoleClosing2Prongs = findAndAddHoleClosing2Prongs;
