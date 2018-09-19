"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svg_1 = require("../../svg/svg");
const find_2_prong_1 = require("./find-2-prong/find-2-prong");
const add_2_prong_1 = require("./add-2-prong");
/**
 * Find and add two-prongs.
 * @param loops
 * @param cpGraphs
 * @param k
 * @param for2Prongs
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd2Prongs(loops, cpGraphs, k, for2Prongs, extreme) {
    let len = for2Prongs.length;
    let index = indexLinear(len); // Keep for possible future use.
    //let index = indexInterlaced(len);
    let cpNode_;
    let bounds = svg_1.getShapeBounds(loops);
    let squaredDiagonalLength = Math.pow((bounds.maxX.p[0] - bounds.minX.p[0]), 2) +
        Math.pow((bounds.maxY.p[1] - bounds.minY.p[1]), 2);
    //console.log(Math.sqrt(squaredDiagonalLength));
    for (let i = 0; i < len; i++) {
        let pos = for2Prongs[index[i]];
        let twoProngInfo;
        twoProngInfo = find_2_prong_1.find2Prong(loops, extreme, squaredDiagonalLength, cpGraphs, pos, false, k);
        if (twoProngInfo) {
            let { circle, z } = twoProngInfo;
            let cpNode = add_2_prong_1.add2Prong(cpGraphs, circle, pos, z, false, extreme);
            if (!cpNode_ && cpNode) {
                cpNode_ = cpNode;
            }
        }
    }
    return cpNode_;
}
exports.findAndAdd2Prongs = findAndAdd2Prongs;
/**
 * Simple linear array indexing.
 * @param n
 */
function indexLinear(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(i);
    }
    return arr;
}
/**
 * Creates a kind of interlaced index vector.
 * @param n
*/
function indexInterlaced(n) {
    let source = {};
    let arr = [];
    // l is the lowest power of 2 so that 2^l > n
    let l = Math.pow(2, Math.floor(Math.log2(n)));
    while (l >= 1) {
        let k = 0;
        while (k < n) {
            if (!source[k]) {
                arr.push(k);
                source[k] = true;
            }
            k = k + l;
        }
        l = l / 2;
    }
    return arr;
}
