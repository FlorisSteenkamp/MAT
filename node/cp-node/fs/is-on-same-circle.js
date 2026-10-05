/**
 * Returns true if the 2 given `CpNode`s are on the same maximal disk
 * circle.
 *
 * * O(1): all `CpNode`s on the same on-circle ring share the same `Circle`
 *   object, and no other ring does (see `PointOnShape.circle`)
 *
 * @param cpNode1 A `CpNode`.
 * @param cpNode2 Another `CpNode`
 */
function isOnSameCircle(cpNode1, cpNode2) {
    return cpNode1.pointOnShape.circle === cpNode2.pointOnShape.circle;
}
export { isOnSameCircle };
//# sourceMappingURL=is-on-same-circle.js.map