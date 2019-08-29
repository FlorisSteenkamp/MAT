"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_poly_1 = require("flo-poly");
const curve_1 = require("./curve");
/**
 * Represents a two-way linked loop of [[Curve]]s - mostly used internally to
 * conveniently represent shape boundaries.
 */
class Loop {
    /**
     * @param beziers A pre-ordered array of bezier curves to add initially.
     */
    constructor(beziers = []) {
        this.beziers = beziers;
        this.curves = [];
        let loop = this;
        if (beziers.length === 0) {
            return undefined;
        }
        let head;
        let prev = null;
        let node;
        for (let i = 0; i < beziers.length; i++) {
            node = new curve_1.Curve(loop, beziers[i], prev, null, i);
            loop.curves.push(node);
            if (prev) {
                prev.next = node;
            }
            prev = node;
            if (i === 0) {
                head = node;
            }
        }
        // Close loop
        head.prev = node;
        node.next = head;
        this.head = head;
    }
}
exports.Loop = Loop;
/**
 * @hidden
 * Perturbs the loop. Not used.
 * @param loop
 * @param x
 */
function perturb(loop, x) {
    if (!x) {
        return loop;
    }
    let seed = 2311; // Just some value
    let newItems = [];
    for (let i = 0; i < loop.beziers.length; i++) {
        // This gets us a predictable random number between 0 and 1;
        let rand1 = flo_poly_1.flatCoefficients(6, -1, 1, seed);
        let rs = rand1.p;
        seed = rand1.seed; // Get next seed.
        let vs = rs.map(r => r * x);
        let ps = loop.beziers[i];
        let [[x0, y0], [x1, y1], [x2, y2]] = ps;
        let newPs = [
            [x0 + vs[0], y0 + vs[1]],
            [x1 + vs[2], y1 + vs[3]],
            [x2 + vs[4], y2 + vs[5]],
            [0, 0]
        ];
        if (i !== 0) {
            let prev = newItems[newItems.length - 1];
            prev[3][0] = newPs[0][0];
            prev[3][1] = newPs[0][1];
        }
        newItems.push(newPs);
    }
    let last = newItems[newItems.length - 1];
    last[3][0] = newItems[0][0][0];
    last[3][1] = newItems[0][0][1];
    return new Loop(newItems);
}
//# sourceMappingURL=loop.js.map