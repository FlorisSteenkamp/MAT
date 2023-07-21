/**
 * Returns a human-readable string of the given [[PointOnShape]].
 * For debugging only.
 * @internal
 */
function posToHumanString(pos) {
    return '' + pos.p[0] + ', ' + pos.p[1] +
        ' | bz: ' + pos.curve.idx +
        ' | t: ' + pos.t;
}
export { posToHumanString };
//# sourceMappingURL=pos-to-human-string.js.map