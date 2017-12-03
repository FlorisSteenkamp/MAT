"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const circle_1 = require("./circle");
const geometry_1 = require("../geometry");
class Arc {
    /**
     * Arc class.
     * If circle === null then the arc degenerates into a line segment
     * given by sinAngle1 and cosAngle2 which now represent points.
     * The arc curve is always defined as the piece from angle1 -> angle2.
     * Note: startpoint and endpoint is redundant
     */
    constructor(circle, sinAngle1, cosAngle1, sinAngle2, cosAngle2, startpoint, endpoint) {
        // Intrinsic
        this.circle = circle;
        this.sinAngle1 = sinAngle1;
        this.sinAngle2 = sinAngle2;
        this.cosAngle1 = cosAngle1;
        this.cosAngle2 = cosAngle2;
        // Cache
        this.startpoint = startpoint; // Redundant but useful
        this.endpoint = endpoint; // Redundant but useful
    }
    /**
     * Returns the closest point on the arc.
     * NOTE: Not currently used.
     * @private
     */
    static closestPointOnArc(p, arc) {
        if (arc.circle !== null) {
            // First move arc circle onto origin
            let x = arc.circle.center[0];
            let y = arc.circle.center[1];
            let translate = flo_vector2d_1.default.translate([-x, -y]);
            let arco = new Arc(new circle_1.default([0, 0], arc.circle.radius), arc.sinAngle1, arc.cosAngle1, arc.sinAngle2, arc.cosAngle2, translate(arc.startpoint), translate(arc.endpoint));
            let pp = translate(p);
            let l = flo_vector2d_1.default.len(pp);
            let sin_pp = -pp[1] / l;
            let cos_pp = pp[0] / l;
            if (geometry_1.default.isAngleBetween(sin_pp, cos_pp, arco.sinAngle1, arco.cosAngle1, arco.sinAngle2, arco.cosAngle2)) {
                let r_o_l = arco.circle.radius;
                let res = { p: flo_vector2d_1.default.translate([x, y], [r_o_l * cos_pp, r_o_l * -sin_pp]), position: 0 };
                return res;
            }
            else {
                let asp = arc.startpoint;
                let aep = arc.endpoint;
                let d1 = flo_vector2d_1.default.distanceBetween(asp, p);
                let d2 = flo_vector2d_1.default.distanceBetween(aep, p);
                if (d1 < d2) {
                    return { p: asp, position: 1 };
                }
                return { p: aep, position: 2 };
            }
        }
        // Line degenerate case - this is exactly a routine for 
        // distance (and closest point) between point and line segment.
        let asp = arc.startpoint;
        let aep = arc.endpoint;
        let d1 = flo_vector2d_1.default.distanceBetween(asp, p);
        let d2 = flo_vector2d_1.default.distanceBetween(aep, p);
        let ds = Math.sqrt(flo_vector2d_1.default.squaredDistanceBetweenPointAndLineSegment(p, [asp, aep]));
        if (d1 <= d2 && d1 <= ds) {
            return { p: asp, position: 1 };
        }
        else if (d2 <= d1 && d2 <= ds) {
            return { p: aep, position: 2 };
        }
        // else ds is shortest
        let v = flo_vector2d_1.default.fromTo(asp, aep);
        let l1p2 = [p[0] + v[1], p[1] + -v[0]];
        let res = {
            p: geometry_1.default.lineLineIntersection([p, l1p2], [asp, aep]),
            position: 0,
        };
        return res;
    }
}
exports.default = Arc;
