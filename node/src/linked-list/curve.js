"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_memoize_1 = require("flo-memoize");
const flo_bezier3_1 = require("flo-bezier3");
const flo_vector2d_1 = require("flo-vector2d");
let memoize = flo_memoize_1.default.m1;
/**
 * Representation of a linked loop vertex (i.e. a bezier) within a linked loop.
 */
class Curve {
    /**
     * @param loop The linked loop this node belongs to.
     * @param ps The actual item stored at a node.
     * @param prev The previous item.
     * @param next The next item.
     * @param idx The curve's ordered index in the loop.
     */
    constructor(loop, ps, prev, next, idx) {
        this.loop = loop;
        this.ps = ps;
        this.prev = prev;
        this.next = next;
        this.idx = idx;
    }
    get corner() { return getCorner(this); }
    /**
     * Advances the node by the given number of steps. This is slow ( O(n) );
     * use mostly for debugging.
     * @param node - Node to start counting from
     * @param n - Number of steps to advance
     */
    static advanceNSteps(node, n) {
        for (let i = 0; i < n; i++) {
            node = node.next;
        }
        return node;
    }
}
exports.Curve = Curve;
// Angle in degrees
const DEGREES = {
    //'0'    : 0.0000,
    '0.25': 0.0050,
    '1': 0.0167,
    '4': 0.0698,
    '16': 0.2756,
};
const DEGREE_LIMIT = DEGREES['0.25'];
/**
 * Gets the cross of the unit tangents of the vector at the end of this
 * curve and the start of the next curve.
 */
let getCorner = memoize(function (curve) {
    let bezierNodes = [curve, curve.next];
    let curve1 = bezierNodes[0].ps;
    let curve2 = bezierNodes[1].ps;
    let tans = [
        flo_bezier3_1.tangent(curve1, 1),
        flo_bezier3_1.tangent(curve2, 0)
    ];
    let crossTangents = flo_vector2d_1.cross(tans[0], tans[1]);
    return {
        tans,
        crossTangents,
        isDull: crossTangents > 0,
        isQuiteSharp: crossTangents < -DEGREE_LIMIT,
        isQuiteDull: crossTangents > DEGREE_LIMIT
    };
});
