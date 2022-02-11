import { getShapeBounds } from '../../svg/get-shape-bounds.js';
import { getMinYPos } from '../../svg/get-min-y-pos.js';
import { find2Prong } from './find-2-prong/find-2-prong.js';
import { add2Prong } from './add-2-prong.js';
/**
 * @hidden
 * Find and add two-prongs that remove any holes in the shape.
 * @param loops The loops (that as a precondition must be ordered from
 * highest (i.e. smallest y-value) topmost point loops to lowest)
 * @param cpTrees
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAddHoleClosing2Prongs(loops, cpTrees, extreme) {
    let bounds = getShapeBounds(loops);
    let squaredDiagonalLength = (bounds.maxX.p[0] - bounds.minX.p[0]) ** 2 +
        (bounds.maxY.p[1] - bounds.minY.p[1]) ** 2;
    // Find the topmost points on each loop.
    let minYs = loops.map(getMinYPos);
    // We start at 1 since 0 is the outer (root) loop
    for (let k = 1; k < minYs.length; k++) {
        let posSource = minYs[k];
        let holeClosingTwoProng = find2Prong(loops, extreme, squaredDiagonalLength, cpTrees, posSource, true, k);
        if (!holeClosingTwoProng) {
            throw new Error(`Unable to find hole-closing 2-prong`);
        }
        // TODO important - handle case of n-prong, i.e. more than one antipode
        // - currently we only handle case of single antipode (the general case)
        let { circle, zs: posAntipodes } = holeClosingTwoProng;
        add2Prong(cpTrees, circle, posSource, [posAntipodes[0]], true, extreme);
    }
}
export { findAndAddHoleClosing2Prongs };
//# sourceMappingURL=find-and-add-hole-closing-2-prongs.js.map