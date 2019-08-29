"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const flo_gauss_quadrature_1 = require("flo-gauss-quadrature");
const flo_poly_1 = require("flo-poly");
/**
 * @hidden
 * See e.g. https://mathinsight.org/greens_theorem_find_area
 */
function getLoopArea(loop) {
    let totalArea = 0;
    for (let curve of loop.curves) {
        let ps = curve.ps;
        let x = flo_bezier3_1.getX(ps);
        let y = flo_bezier3_1.getY(ps);
        let dx = flo_bezier3_1.getDx(ps);
        let dy = flo_bezier3_1.getDy(ps);
        // xy' named as xy_
        let xy_ = flo_poly_1.multiply(x, dy);
        let yx_ = flo_poly_1.negate(flo_poly_1.multiply(y, dx));
        let poly = flo_poly_1.add(xy_, yx_);
        let f = flo_poly_1.evaluate(poly);
        let area = flo_gauss_quadrature_1.gaussQuadrature(f, [0, 1], 16);
        totalArea += area;
    }
    return -totalArea / 2;
}
exports.getLoopArea = getLoopArea;
//# sourceMappingURL=get-loop-area.js.map