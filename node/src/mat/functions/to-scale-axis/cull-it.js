"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_leaves_1 = require("./get-leaves");
/**
 * Returns the set Vertices passing the following test: walk the MAT tree and
 * keep all Vertices not in the current cull set and any Vertices that have a
 * non-culled node further down the line toward the tree leaves.
 */
function cullIt(culls, vertex) {
    let leaves = get_leaves_1.getLeaves(vertex);
    while (leaves.length) {
        let leaf = leaves.pop();
        if (!culls.has(leaf.item.vertex)) {
            continue;
        }
        let cp = leaf.next; // Turn around
        let done = false;
        while (!done) {
            cp = cp.next;
            if (cp.isThreeProng()) {
                let cp1 = cp.prevOnCircle;
                cp1.next = cp;
                cp.prev = cp1;
                let cp2 = cp1.prevOnCircle;
                if (cp2.next === cp1) {
                    cp2.next = cp;
                    cp.prev = cp2;
                    // Change 3-prong into a 2-prong since 1 point is redundant.
                    cp2.nextOnCircle = cp;
                    cp.prevOnCircle = cp2;
                    cp.item.vertex.cps = [cp, cp2];
                    leaves.push(cp2);
                }
                else if (cp.next === cp2) {
                    cp1.next = cp2;
                    cp2.prev = cp1;
                    // Change 3-prong into a 2-prong since 1 point is redundant.
                    cp1.nextOnCircle = cp2;
                    cp2.prevOnCircle = cp1;
                    cp.item.vertex.cps = [cp2, cp1];
                    leaves.push(cp1);
                }
                done = true;
            }
            else if (!culls.has(cp.item.vertex)) {
                let cp1 = cp.prevOnCircle;
                cp1.next = cp;
                cp.prev = cp1;
                done = true;
            }
        }
    }
}
exports.cullIt = cullIt;
