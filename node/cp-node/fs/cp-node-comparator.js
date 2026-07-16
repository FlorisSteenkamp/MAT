import { comparePoss } from "../../point-on-shape/compare-poss.js";
/**
 * Primarily for internal use.
 *
 * Compares the order of two `CpNode`s. The order is cyclic and depends
 * on a `CpNode`'s relative position along the shape boundary.
 */
function cpNodeComparator(a, b) {
    return comparePoss(a.pointOnShape, b.pointOnShape);
}
export { cpNodeComparator };
//# sourceMappingURL=cp-node-comparator.js.map