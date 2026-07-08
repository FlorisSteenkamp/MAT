import { PointOnShape } from "../../src/point-on-shape/point-on-shape.js";


function comparePossByValue(
        pos1: PointOnShape, pos2: PointOnShape): boolean {

    if (pos1.t !== pos2.t) { return false; }

    if (pos1.p[0] !== pos2.p[0]) { return false; }
    if (pos1.p[1] !== pos2.p[1]) { return false; }
    if (pos1.curve.idx !== pos2.curve.idx) { return false; }
    if (pos1.curve.loop.idx !== pos2.curve.loop.idx) { return false; }
    if (pos1.isSource !== pos2.isSource) { return false; }

    for (let i=0; i<pos1.p.length; i++) {
        if (pos1.p[i] !== pos2.p[i]) {
            return false;
        }
    }

    return true;
}


export { comparePossByValue }
