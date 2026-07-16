import type { PointOnShape } from "../../src/point-on-shape/point-on-shape.js";


function comparePossByValue(
        pos1: PointOnShape, pos2: PointOnShape): boolean {

    if (pos1.t !== pos2.t) { return false; }

    if (pos1.p[0] !== pos2.p[0]) { return false; }
    if (pos1.p[1] !== pos2.p[1]) { return false; }
    if (pos1.curve.idx !== pos2.curve.idx) { return false; }
    if (pos1.curve.loop.idx !== pos2.curve.loop.idx) { return false; }
    if (pos1.isSource !== pos2.isSource) { return false; }
    if (pos1.circle.center[0] !== pos2.circle.center[0]) { return false; }
    if (pos1.circle.center[1] !== pos2.circle.center[1]) { return false; }
    if (pos1.circle.radius !== pos2.circle.radius) { return false; }
    if (pos1.order !== pos2.order) { return false; }
    if (pos1.order2 !== pos2.order2) { return false; }
    if (pos1.t !== pos2.t) { return false; }

    return true;
}


export { comparePossByValue }
