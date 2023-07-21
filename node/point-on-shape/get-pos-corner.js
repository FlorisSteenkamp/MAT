import { getCornerAtEnd } from "../curve.js";
/**
 * @internal
 */
function getPosCorner(pos) {
    return getCornerAtEnd(pos.t === 1 ? pos.curve : pos.curve.prev);
}
export { getPosCorner };
//# sourceMappingURL=get-pos-corner.js.map