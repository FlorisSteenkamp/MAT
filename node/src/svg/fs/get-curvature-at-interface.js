"use strict";
// TODO - move to another library
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const flo_vector2d_1 = require("flo-vector2d");
/**
 * @hidden
 * Get the angle between the given bezier endpoint and the
 * startpoint of the next bezier.
 * @param curve
 */
function getCurvatureAtInterface(curve) {
    const ts = [1, 0];
    let pss = [
        curve.ps,
        curve.next.ps
    ];
    let tans = [
        flo_bezier3_1.tangent(pss[0])(1),
        flo_bezier3_1.tangent(pss[0])(0)
    ];
    // The integral of a kind of Dirac Delta function.
    let cosθ = flo_vector2d_1.dot(tans[0], tans[1]);
    let sinθ = flo_vector2d_1.cross(tans[0], tans[1]);
    let θ = acos(cosθ);
    let result = sinθ >= 0 ? θ : -θ;
    return result;
}
exports.getCurvatureAtInterface = getCurvatureAtInterface;
/**
 * @hidden
 * Floating-point 'safer' version of acos. If x is larger than 1 (or smaller
 * than -1), still returns 0 (or Math.PI) instead of NAN.
 * @param x
 * @example
 * 		acos(1);  //=> 0
 *      acos(2);  //=> 0
 */
function acos(x) {
    if (x > 1) {
        return 0;
    }
    else if (x < -1) {
        return Math.PI;
    }
    return Math.acos(x);
}
//# sourceMappingURL=get-curvature-at-interface.js.map