import { compareCps } from "../../contact-point/contact-point.js";
/**
 * Primarily for internal use.
 *
 * Compares the order of two `CpNode`s. The order is cyclic and depends
 * on a `CpNode`'s relative position along the shape boundary.
 */
function cpNodeComparator(a, b) {
    return compareCps(a.cp, b.cp);
}
export { cpNodeComparator };
//# sourceMappingURL=cp-node-comparator.js.map