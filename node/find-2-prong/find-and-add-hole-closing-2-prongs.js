import { getMinYPos } from '../svg/get-min-y-pos.js';
import { find2Prong } from './find-2-prong.js';
import { add2Prong } from './add-2-prong.js';
/**
 * Find and add two-prongs that close any holes in the shape.
 *
 * @param meta
 *
 * @internal
 */
function findAndAddHoleClosing2Prongs(meta) {
    const { loops } = meta;
    // Find the topmost points on each loop.
    const minYs = loops.map(getMinYPos);
    let cpNode;
    const find2Prong_ = find2Prong(meta);
    // We start at 1 since 0 is the outer (root) loop
    for (let k = 1; k < minYs.length; k++) {
        const pposSource = minYs[k];
        const posAntipode = find2Prong_(true, false, 0, pposSource);
        if (!posAntipode) {
            throw new Error(`Unable to find hole-closing 2-prong`);
        }
        // FUTURE - handle case of n-prong, i.e. more than one antipode
        // - currently we only handle case of single antipode (the general case)
        const { circle, z } = posAntipode;
        const _cpNode = add2Prong(meta, circle, pposSource, z, true);
        cpNode = cpNode === undefined ? _cpNode : cpNode;
    }
    return cpNode;
}
export { findAndAddHoleClosing2Prongs };
//# sourceMappingURL=find-and-add-hole-closing-2-prongs.js.map