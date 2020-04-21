"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param beziers A pre-ordered array of bezier curves to add initially.
 */
function loopFromBeziers(beziers = []) {
    let curves = [];
    let loop = {
        beziers,
        curves
    };
    if (!beziers.length) {
        return loop;
    }
    let prev;
    for (let i = 0; i < beziers.length; i++) {
        let curve = {
            loop,
            ps: beziers[i],
            prev,
            next: undefined,
            idx: i
        };
        if (prev) {
            prev.next = curve;
        }
        prev = curve;
        curves.push(curve);
    }
    // close loop
    let lastCurve = curves[curves.length - 1];
    curves[0].prev = lastCurve;
    lastCurve.next = curves[0];
    return loop;
}
exports.loopFromBeziers = loopFromBeziers;
//# sourceMappingURL=loop.js.map