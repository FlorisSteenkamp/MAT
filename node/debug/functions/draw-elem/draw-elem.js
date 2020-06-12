"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawElemFunctions = void 0;
const one_prong_1 = require("./one-prong");
const two_prong_1 = require("./two-prong");
const three_prong_1 = require("./three-prong");
const vertex_1 = require("./vertex");
const bounding_hull_1 = require("./bounding-hull");
const loose_bounding_box_1 = require("./loose-bounding-box");
const tight_bounding_box_1 = require("./tight-bounding-box");
const sharp_corner_1 = require("./sharp-corner");
const dull_corner_1 = require("./dull-corner");
const mat_1 = require("./mat");
const max_vertex_1 = require("./max-vertex");
const leaves_1 = require("./leaves");
const culls_1 = require("./culls");
const one_prong_at_dull_corner_1 = require("./one-prong-at-dull-corner");
/** @hidden */
function notImplementedYet(g, elem) {
    return []; // TODO - implement relevant drawing function
}
/** @hidden */
let drawElemFunctions = {
    oneProng: one_prong_1.drawOneProng,
    oneProngAtDullCorner: one_prong_at_dull_corner_1.oneProngAtDullCorner,
    twoProng_regular: two_prong_1.twoProng,
    twoProng_failed: two_prong_1.twoProng,
    twoProng_notAdded: two_prong_1.twoProng,
    twoProng_deleted: two_prong_1.twoProng,
    twoProng_holeClosing: two_prong_1.twoProng,
    threeProng: three_prong_1.threeProng,
    //minY,
    boundingHull: bounding_hull_1.boundingHull,
    looseBoundingBox: loose_bounding_box_1.looseBoundingBox,
    tightBoundingBox: tight_bounding_box_1.tightBoundingBox,
    sharpCorner: sharp_corner_1.sharpCorner,
    dullCorner: dull_corner_1.dullCorner,
    vertex: vertex_1.vertex,
    mat: mat_1.drawMat('mat'),
    sat: mat_1.drawMat('sat'),
    //loop,
    //loops,
    maxVertex: max_vertex_1.maxVertex,
    leaves: leaves_1.leaves,
    culls: culls_1.culls,
    cpNode: notImplementedYet
};
exports.drawElemFunctions = drawElemFunctions;
//# sourceMappingURL=draw-elem.js.map