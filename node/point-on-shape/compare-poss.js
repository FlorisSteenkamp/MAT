/**
 * Compares two `PointOnShape`s according to their cyclic ordering imposed
 * by their relative positions on the shape boundary.
 *
 * * Returns a +tive value if `a` is "further along" the loop
 *
 * @param a The first `PointOnShape`.
 * @param b The second `PointOnShape`.
 *
 * @internal
 */
function comparePoss(a, b) {
    let res;
    res = a.curve.idx - b.curve.idx;
    if (res !== 0) {
        return res;
    }
    res = a.t - b.t;
    if (res !== 0) {
        return res;
    }
    res = a.order - b.order;
    if (res !== 0) {
        return res;
    }
    res = a.order2 - b.order2;
    return res;
}
export { comparePoss };
//# sourceMappingURL=compare-poss.js.map