"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../../mat-constants");
function getSharpCorners(possPerLoop) {
    let sharpCornersPerLoop = [];
    for (let poss of possPerLoop) {
        let sharpCorners = [];
        for (let pos of poss) {
            if (pos.type === mat_constants_1.MAT_CONSTANTS.pointType.sharp) {
                sharpCorners.push(pos);
            }
        }
        sharpCornersPerLoop.push(sharpCorners);
    }
    return sharpCornersPerLoop;
}
exports.getSharpCorners = getSharpCorners;
