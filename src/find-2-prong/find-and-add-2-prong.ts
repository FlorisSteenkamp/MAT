import { CpNode } from "../cp-node/cp-node.js";
import { MatMeta } from "../mat/mat-meta.js";
import { PointOnShape } from "../point-on-shape/point-on-shape.js";
import { add2Prong } from "./add-2-prong.js";
import { find2Prong } from "./find-2-prong.js";


/**
 * Just to simplify `find2Prong` a bit.
 * 
 * * Cannot be used with holeClosers or angles other than 0
 * * Can be used after the mat has been found
 */
function findAndAdd2Prong(
        meta: MatMeta,
        y: PointOnShape): CpNode | undefined {

    const twoProngInfo = find2Prong(meta, false, false, 0, y);
    if (twoProngInfo === undefined) {
        return undefined;
    }

    const { circle, zs } = twoProngInfo;
    const cpNode = add2Prong(meta, circle, [y, ...zs], false);

    return cpNode;
}


export { findAndAdd2Prong }
