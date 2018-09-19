"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const one_prong_1 = require("./one-prong");
const two_prong_1 = require("./two-prong");
const three_prong_1 = require("./three-prong");
const vertex_1 = require("./vertex");
const min_y_1 = require("./min-y");
const bounding_hull_1 = require("./bounding-hull");
const loose_bounding_box_1 = require("./loose-bounding-box");
const tight_bounding_box_1 = require("./tight-bounding-box");
const sharp_corner_1 = require("./sharp-corner");
const dull_corner_1 = require("./dull-corner");
const mat_1 = require("./mat");
const one_prong_at_dull_corner_1 = require("./one-prong-at-dull-corner");
const loop_1 = require("./loop");
const loops_1 = require("./loops");
let drawElemFunctions = {
    oneProng: one_prong_1.oneProng,
    oneProngAtDullCorner: one_prong_at_dull_corner_1.oneProngAtDullCorner,
    twoProng_regular: two_prong_1.twoProng,
    twoProng_failed: two_prong_1.twoProng,
    twoProng_notAdded: two_prong_1.twoProng,
    twoProng_deleted: two_prong_1.twoProng,
    twoProng_holeClosing: two_prong_1.twoProng,
    threeProng: three_prong_1.threeProng,
    minY: min_y_1.minY,
    boundingHull: bounding_hull_1.boundingHull,
    looseBoundingBox: loose_bounding_box_1.looseBoundingBox,
    tightBoundingBox: tight_bounding_box_1.tightBoundingBox,
    sharpCorner: sharp_corner_1.sharpCorner,
    dullCorner: dull_corner_1.dullCorner,
    vertex: vertex_1.vertex,
    mat: mat_1.mat('mat', true),
    sat: mat_1.mat('sat', true),
    loop: loop_1.loop,
    loops: loops_1.loops
};
exports.drawElemFunctions = drawElemFunctions;
