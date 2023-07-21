import { memoize } from "flo-memoize";
import { getPosCorner } from "./get-pos-corner.js";
import { isPosCorner } from "./is-pos-corner.js";
/**
 * @internal
 */
const isPosDullCorner = memoize((pos) => {
    if (!isPosCorner(pos)) {
        return false;
    }
    return getPosCorner(pos).isDull;
});
export { isPosDullCorner };
//# sourceMappingURL=is-pos-dull-corner.js.map