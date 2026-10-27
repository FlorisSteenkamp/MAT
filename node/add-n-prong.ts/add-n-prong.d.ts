import type { CpNode } from '../cp-node/cp-node.js';
import type { Circle } from '../geometry/circle.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * @internal
 * Adds an n-prong (n >= 2) maximal disk (not a hole-closer) to the MAT and
 * returns one of its `CpNode`s (or `undefined` if nothing was added).
 *
 * If some contact point lies on top of a contact point of an existing vertex
 * with the same maximal disk then the new contact points are added to that
 * vertex instead. Otherwise, if any contact point lies on top of an existing
 * `CpNode`, nothing is added (it can cause floating point stability issues).
 *
 * @param meta
 * @param circle the maximal disk
 * @param poss the contact points
 */
declare function addNProng(meta: MatMeta, circle: Circle, poss: PrePointOnShape[]): CpNode | undefined;
export { addNProng };
