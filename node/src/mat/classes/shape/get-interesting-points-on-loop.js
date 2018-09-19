"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../../mat-constants");
const get_contact_circles_at_interface_1 = require("../../functions/get-contact-circles-at-interface");
const get_bezier_osculating_circles_1 = require("../../functions/get-bezier-osculating-circles");
const point_on_shape_1 = require("../../classes/point-on-shape");
/**
 * Get useful points on the shape - these incude osculating points and points at
 * the bezier-bezier interfaces.
 * @param loop
 */
function getInterestingPointsOnLoop(loop) {
    let allPoints = [];
    loop.forEach(function (node) {
        let pointsOnShape1 = get_contact_circles_at_interface_1.getContactCirclesAtInterface(node);
        allPoints.push(...pointsOnShape1);
        let pointsOnShape2 = get_bezier_osculating_circles_1.getBezierOsculatingCircles(node);
        allPoints.push(...pointsOnShape2);
        // TODO - maybe remove; experimenting
        for (let i = 1; i < 2; i++) {
            let pos = new point_on_shape_1.PointOnShape(node, i / 2, mat_constants_1.MAT_CONSTANTS.pointType.standard);
            allPoints.push(pos);
        }
        node = node.next;
    });
    allPoints.sort(point_on_shape_1.PointOnShape.compare);
    // Check if at least one 2-prong has been added. If not, add one.
    let atLeast1 = false;
    for (let i = 0; i < allPoints.length; i++) {
        if (allPoints[i].type !== mat_constants_1.MAT_CONSTANTS.pointType.sharp) {
            atLeast1 = true;
            break;
        }
    }
    if (!atLeast1) {
        // Not a single potential 2-prong found on envelope. Add one to make the 
        // algorithm simpler from here on.
        let bezier = loop.head;
        let pos = new point_on_shape_1.PointOnShape(bezier, 0.4999995, // Can really be anything in the range (0,1)
        mat_constants_1.MAT_CONSTANTS.pointType.standard);
        allPoints.push(pos);
    }
    return allPoints;
}
exports.getInterestingPointsOnLoop = getInterestingPointsOnLoop;
