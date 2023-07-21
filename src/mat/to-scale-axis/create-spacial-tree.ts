import { Circle } from '../../circle.js';
import { TTree } from './t-tree.js';
import { addToTree } from './add-to-tree.js';


/** @internal */
const width  = 1620; // TODO change to actual shape coordinates
/** @internal */
const height = 1560; // ...


/**
 * @internal
 * @param s 
 * @param circles 
 */
function createSpacialTree(
        s: number, 
        circles: Circle[]) {

    const coordinate = 0;
    const limits = [[0, width], [0, height]];

    const tree: TTree = { trees: new Map(), circles: new Set() };

    for (const circle of circles) {
        addToTree(
                s, 
                tree, 
                coordinate, 
                limits, 
                circle, 
                0
        );
    }

    return tree;
}


export { createSpacialTree }
