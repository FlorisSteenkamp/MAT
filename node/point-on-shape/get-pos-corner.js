import { memoize } from 'flo-memoize';
import { getCorner } from "../corner/get-corner.js";
/**
 * @internal
 */
const getPosCorner$ = memoize(function (pos) {
    const { t, curve } = pos;
    return getCorner(t === 1 ? curve.ps : curve.prev.ps, t === 1 ? curve.next.ps : curve.ps);
});
export { getPosCorner$ };
//# sourceMappingURL=get-pos-corner.js.map