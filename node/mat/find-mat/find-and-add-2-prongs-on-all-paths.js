import { findAndAdd2Prongs } from './find-and-add-2-prongs.js';
/**
 * @hidden
 * Add 2 prongs. See comments on the add2Prong function.
 * @param loops
 * @param cpGraphs
 * @param for2Prongss
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd2ProngsOnAllPaths(loops, cpGraphs, for2Prongss, extreme) {
    let cpNode;
    for (let k = 0; k < for2Prongss.length; k++) {
        let for2Prongs = for2Prongss[k];
        let _cpNode = findAndAdd2Prongs(loops, cpGraphs, k, for2Prongs, extreme);
        cpNode = cpNode || _cpNode;
    }
    return cpNode;
}
export { findAndAdd2ProngsOnAllPaths };
//# sourceMappingURL=find-and-add-2-prongs-on-all-paths.js.map