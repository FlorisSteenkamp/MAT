import { memoize } from 'flo-memoize';
import { isPosCorner } from './is-pos-corner.js';
import { getPosCorner } from './get-pos-corner.js';
/**
 * @internal
 */
const isPosQuiteSharpCorner = memoize((pos) => {
    if (!isPosCorner(pos)) {
        return false;
    }
    return getPosCorner(pos).isQuiteSharp;
});
export { isPosQuiteSharpCorner };
//# sourceMappingURL=is-pos-quite-sharp-corner.js.map