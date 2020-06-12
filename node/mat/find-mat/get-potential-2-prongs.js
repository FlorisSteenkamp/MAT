"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPotential2Prongs = void 0;
const point_on_shape_1 = require("../../point-on-shape");
/** @hidden */
function getPotential2Prongs(possPerLoop) {
    let for2ProngsArray = [];
    for (let poss of possPerLoop) {
        let for2Prongs = [];
        for (let pos of poss) {
            if (!point_on_shape_1.isPosQuiteSharpCorner(pos)) {
                for2Prongs.push(pos);
            }
        }
        for2ProngsArray.push(for2Prongs);
    }
    return for2ProngsArray;
}
exports.getPotential2Prongs = getPotential2Prongs;
//# sourceMappingURL=get-potential-2-prongs.js.map