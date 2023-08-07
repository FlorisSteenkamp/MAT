import { findAndAdd2Prongs } from './find-and-add-2-prongs.js';
import { fixOrdering } from '../find-mat/fix-ordering.js';
/**
 * @internal
 * Add 2 prongs. See comments on the add2Prong function.
 * @param loops
 * @param cpGraphs
 * @param for2Prongss
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd2ProngsOnAllPaths(cpNode, loops, cpGraphs, for2Prongss, extreme, for1Prongs) {
    for (let k = 0; k < for2Prongss.length; k++) {
        const for2Prongs = for2Prongss[k];
        const _cpNode = findAndAdd2Prongs(loops, cpGraphs, k, for2Prongs, extreme, for1Prongs);
        cpNode = cpNode || _cpNode;
    }
    fixOrdering(cpNode);
    return cpNode;
}
export { findAndAdd2ProngsOnAllPaths };
//# sourceMappingURL=find-and-add-2-prongs-on-all-paths.js.map