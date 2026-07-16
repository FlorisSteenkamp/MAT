import { getPosCorner$ } from "./get-pos-corner.js";
import { isPosCorner } from "./is-pos-corner.js";
/**
 * @internal
 */
function isPosSharpCorner(pos) {
    if (!isPosCorner(pos)) {
        return false;
    }
    return getPosCorner$(pos).isSharp;
}
export { isPosSharpCorner };
//# sourceMappingURL=is-pos-sharp-corner.js.map