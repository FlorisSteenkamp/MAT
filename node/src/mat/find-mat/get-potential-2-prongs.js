"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../point-on-shape");
function getPotential2Prongs(possPerLoop) {
    let for2ProngsArray = [];
    for (let poss of possPerLoop) {
        let for2Prongs = [];
        for (let pos of poss) {
            if (!point_on_shape_1.PointOnShape.isQuiteSharpCorner(pos)) {
                for2Prongs.push(pos);
            }
        }
        for2ProngsArray.push(for2Prongs);
    }
    return for2ProngsArray;
}
exports.getPotential2Prongs = getPotential2Prongs;
