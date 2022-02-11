import { addToTree } from './add-to-tree.js';
/** @hidden */
const width = 1620; // TODO change to actual shape coordinates
/** @hidden */
const height = 1560; // ...
/**
 * @hidden
 * @param s
 * @param circles
 */
function createSpacialTree(s, circles) {
    let coordinate = 0;
    let limits = [[0, width], [0, height]];
    let tree = { trees: new Map(), circles: new Set() };
    for (let circle of circles) {
        addToTree(s, tree, coordinate, limits, circle, 0);
    }
    return tree;
}
export { createSpacialTree };
//# sourceMappingURL=create-spacial-tree.js.map