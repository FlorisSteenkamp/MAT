import type { Corner } from "../corner/corner.js";
import type { Curve } from "flo-boolean";
import { memoize } from 'flo-memoize';
import { getCorner } from "../corner/get-corner.js";


/**
 * @internal
 */
const getPosCorner$ = memoize(function(
        pos: { t: number, curve: Curve}): Corner {

    const { t, curve } = pos;

    return getCorner(
        t === 1 ? curve.ps : curve.prev.ps,
        t === 1 ? curve.next.ps : curve.ps,
    );
});


export { getPosCorner$ }
