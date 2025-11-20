import { getCorner } from "../corner/get-corner.js";
/**
 * @internal
 */
// const getPosCorner$ = memoize(
function getPosCorner(pos) {
    return getCorner(pos.t === 1 ? pos.curve.ps : pos.curve.prev.ps, pos.t === 1 ? pos.curve.next.ps : pos.curve.ps);
}
// );
export { getPosCorner };
//# sourceMappingURL=get-pos-corner.js.map