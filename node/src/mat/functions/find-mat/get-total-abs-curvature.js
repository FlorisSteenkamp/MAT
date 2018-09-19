"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const svg_1 = require("../../../svg/svg");
const get_total_by_1 = require("./get-total-by");
/**
 *
 */
let getTotalAbsoluteCurvature = get_total_by_1.getTotalBy(function (_bezier_) {
    return flo_bezier3_1.totalAbsoluteCurvature(_bezier_.ps, [0, 1]) +
        Math.abs(svg_1.getCurvatureAtInterface(_bezier_));
});
exports.getTotalAbsoluteCurvature = getTotalAbsoluteCurvature;
