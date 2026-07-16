/**
 * Returns true if this `CpNode` represents a sharp corner, i.e. the
 * limiting case of a two-prong having zero radius.
 *
 * Note that two `CpNode`s are stored for each sharp corner, one being
 * terminating and one not. See `isTerminating` for more details.
 */
function isSharp(cpNode) {
    return cpNode.pointOnShape.circle.radius === 0;
}
export { isSharp };
//# sourceMappingURL=is-sharp.js.map