"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const svg_1 = require("../../svg/svg");
const get_total_by_1 = require("./get-total-by");
/**
 *
 */
let getTotalAbsoluteCurvature = get_total_by_1.getTotalBy(curve => (flo_bezier3_1.totalAbsoluteCurvature(curve.ps, [0, 1]) +
    Math.abs(svg_1.getCurvatureAtInterface(curve))));
exports.getTotalAbsoluteCurvature = getTotalAbsoluteCurvature;
