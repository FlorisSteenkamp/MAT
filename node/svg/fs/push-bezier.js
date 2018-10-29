"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const de_pathologify_1 = require("./de-pathologify");
const is_almost_zero_length_1 = require("./is-almost-zero-length");
// TODO - 1e4 is arbitrary
const RESOLUTION = 1e4;
/**
 *
 * @param beziers The array of path curves
 * @param ps_ The bezier
 * @param state The current path state
 */
function pushBezier(beziers, ps_, s, max) {
    /*
if ( isAlmostZeroLength(ps_, max/RESOLUTION) ) {
if ( isAlmostZeroLength(ps_, 0) ) {
    return;
}
//console.log(ps_);
}

beziers.push(ps_);
*/
    if (is_almost_zero_length_1.isAlmostZeroLength(ps_, max / RESOLUTION)) {
        let len = beziers.length;
        if (len === 0) {
            s.initialPoint = ps_[3];
        }
        else {
            let prevPs = beziers[len - 1];
            prevPs[3] = ps_[3];
        }
        return;
    }
    let ps = de_pathologify_1.dePathologify(ps_, max);
    beziers.push(ps);
}
exports.pushBezier = pushBezier;
//# sourceMappingURL=push-bezier.js.map