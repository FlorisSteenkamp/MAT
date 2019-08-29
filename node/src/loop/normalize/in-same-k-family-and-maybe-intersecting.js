"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const are_boxes_intersecting_1 = require("../../sweep-line/are-boxes-intersecting");
/** @hidden */
function inSameKFamliyAndMaybeIntersecting(ps1, ps2) {
    let bbPs1 = flo_bezier3_1.getBoundingBox(ps1);
    let bbPs2 = flo_bezier3_1.getBoundingBox(ps2);
    // We need to take special care of horizontal / vertical lines since their
    // open bounding boxes vanish and even though an intersection may exist
    // between ps1 and ps2 it will be reported otherwise.
    if (flo_bezier3_1.isHorizontalLine(ps1) && flo_bezier3_1.isHorizontalLine(ps2)) {
        if (ps1[0][1] !== ps2[0][1]) {
            return false;
        }
        let [[ax0,], [ax1,]] = bbPs1;
        let [[bx0,], [bx1,]] = bbPs2;
        // Swap so smaller coordinate comes first
        if (ax0 > ax1) {
            [ax0, ax1] = [ax1, ax0];
        }
        ;
        if (bx0 > bx1) {
            [bx0, bx1] = [bx1, bx0];
        }
        ;
        return ax0 < bx1 && ax1 > bx0;
    }
    else if (flo_bezier3_1.isVerticalLine(ps1) && flo_bezier3_1.isVerticalLine(ps2)) {
        if (ps1[0][0] !== ps2[0][0]) {
            return false;
        }
        let [[, ay0], [, ay1]] = bbPs1;
        let [[, by0], [, by1]] = bbPs2;
        // Swap so smaller coordinate comes first
        if (ay0 > ay1) {
            [ay0, ay1] = [ay1, ay0];
        }
        ;
        if (by0 > by1) {
            [by0, by1] = [by1, by0];
        }
        ;
        return by0 < ay1 && by1 > ay0;
    }
    // It is better to check for open box intersection in this case, 
    // otherwise many beziers will be reported as possibly intersecting
    // even though they intersect only at endpoints which we don't care
    // about here.
    let areBoxesIntersectingOpen = are_boxes_intersecting_1.areBoxesIntersecting(false);
    return (areBoxesIntersectingOpen(bbPs1, bbPs2) &&
        flo_bezier3_1.areBeziersInSameKFamily(ps1, ps2));
}
exports.inSameKFamliyAndMaybeIntersecting = inSameKFamliyAndMaybeIntersecting;
//# sourceMappingURL=in-same-k-family-and-maybe-intersecting.js.map