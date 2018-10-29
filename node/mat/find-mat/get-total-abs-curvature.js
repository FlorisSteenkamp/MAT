"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const get_curvature_at_interface_1 = require("../../svg/fs/get-curvature-at-interface");
const get_total_by_1 = require("./get-total-by");
/**
 *
 */
let getTotalAbsoluteCurvature = get_total_by_1.getTotalBy(curve => (flo_bezier3_1.totalAbsoluteCurvature(curve.ps, [0, 1]) +
    Math.abs(get_curvature_at_interface_1.getCurvatureAtInterface(curve))));
exports.getTotalAbsoluteCurvature = getTotalAbsoluteCurvature;
//# sourceMappingURL=get-total-abs-curvature.js.map