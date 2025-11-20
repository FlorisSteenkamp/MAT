import { findAndAdd2Prongs } from './find-and-add-2-prongs.js';
/**
 * @internal
 * Add 2 prongs. See comments on the add2Prong function.
 *
 * @param meta
 * @param angleIncrement
 * @param for2Prongss
 * @param for1Prongs
 */
function findAndAdd2ProngsOnAllLoops(meta, angleIncrement, for2Prongss, for1Prongs) {
    let cpNode;
    for (let k = 0; k < for2Prongss.length; k++) {
        const for2Prongs = for2Prongss[k];
        const _cpNode = findAndAdd2Prongs(meta, angleIncrement, for2Prongs, for1Prongs);
        cpNode = cpNode === undefined ? _cpNode : cpNode;
    }
    return cpNode;
}
export { findAndAdd2ProngsOnAllLoops };
//# sourceMappingURL=find-and-add-2-prongs-on-all-loops.js.map