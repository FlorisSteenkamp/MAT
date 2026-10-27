import type { CpNode } from '../cp-node/cp-node.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * @internal
 * Adds the given contact points to the existing vertex (maximal disk) of the
 * given `CpNode`, e.g. turning a 3-prong into a 4-prong, and returns the newly
 * inserted `CpNode`s (or `undefined` if they could not be inserted, in which
 * case nothing changes).
 *
 * The contact points are assumed to lie on the vertex's circle.
 *
 * @param insertIfOrderIsWrong
 * @param meta
 * @param vertex a `CpNode` on the vertex
 * @param poss the contact points to add
 */
declare function addToVertex(insertIfOrderIsWrong: boolean, meta: MatMeta, vertex: CpNode, poss: PrePointOnShape[]): CpNode[] | undefined;
export { addToVertex };
