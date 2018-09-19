"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bezier3 = require("flo-bezier3");
const Vector = require("flo-vector2d");
/**
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
        Bezier3.tangent(pss[0])(1),
        Bezier3.tangent(pss[0])(0)
    ];
    // The integral of a kind of Dirac Delta function.
    let cosθ = Vector.dot(tans[0], tans[1]);
    let sinθ = Vector.cross(tans[0], tans[1]);
    let θ = acos(cosθ);
    let result = sinθ >= 0 ? θ : -θ;
    return result;
}
exports.getCurvatureAtInterface = getCurvatureAtInterface;
/**
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
