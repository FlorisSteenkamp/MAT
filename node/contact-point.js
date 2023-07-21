import { comparePoss } from './point-on-shape/compare-poss.js';
/**
 * Primarily for internal use.
 *
 * Compares the two contact points according to their order along the shape
 * boundary. Returns > 0 if a > b, < 0 if a < b or 0 if a === b.
 * @param a The first contact point.
 * @param b The second contact point.
 */
function compareCps(a, b) {
    let res = comparePoss(a.pointOnShape, b.pointOnShape);
    if (res !== 0) {
        return res;
    }
    res = a.order - b.order;
    if (res !== 0) {
        return res;
    }
    return a.order2 - b.order2;
}
export { compareCps };
//# sourceMappingURL=contact-point.js.map