import { CpNode } from "../cp-node/cp-node.js";
import { MatMeta } from "../mat/mat-meta.js";
import { PointOnShape } from "../point-on-shape/point-on-shape.js";
/**
 * Just to simplify `find2Prong` a bit.
 *
 * * Cannot be used with holeClosers or angles other than 0
 * * Can be used after the mat has been found
 */
declare function findAndAdd2Prong(meta: MatMeta, y: PointOnShape): CpNode | undefined;
export { findAndAdd2Prong };
