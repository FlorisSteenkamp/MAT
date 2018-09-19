"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../../mat-constants");
/**
 * Get potential 2-prong points on shape.
 * @param shape
 */
function getPotential2Prongs(possPerLoop) {
    let for2ProngsArray = [];
    for (let poss of possPerLoop) {
        let for2Prongs = [];
        for (let pos of poss) {
            if (pos.type !== mat_constants_1.MAT_CONSTANTS.pointType.sharp) {
                for2Prongs.push(pos);
            }
        }
        for2ProngsArray.push(for2Prongs);
    }
    return for2ProngsArray;
}
exports.getPotential2Prongs = getPotential2Prongs;
