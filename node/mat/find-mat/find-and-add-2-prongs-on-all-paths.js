"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const find_and_add_2_prongs_1 = require("./find-and-add-2-prongs");
/**
 * Add 2 prongs. See comments on the add2Prong function.
 * @param loops
 * @param cpGraphs
 * @param for2Prongss
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd2ProngsOnAllPaths(loops, cpGraphs, for2Prongss, extreme) {
    let cpNode;
    //console.log(loops);
    for (let k = 0; k < for2Prongss.length; k++) {
        let for2Prongs = for2Prongss[k];
        cpNode = find_and_add_2_prongs_1.findAndAdd2Prongs(loops, cpGraphs, k, for2Prongs, extreme);
    }
    return cpNode;
}
exports.findAndAdd2ProngsOnAllPaths = findAndAdd2ProngsOnAllPaths;
//# sourceMappingURL=find-and-add-2-prongs-on-all-paths.js.map