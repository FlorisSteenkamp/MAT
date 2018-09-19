
declare var _debug_: MatDebug; 

import { MatDebug } from '../../debug/debug';

import { Circle } from '../../circle';

import { TTree } from './t-tree';
import { addToTree } from './add-to-tree';


const width  = 1620; // TODO change to actual shape coordinates
const height = 1560; // ...


/**
 * 
 * @param s 
 * @param circles 
 */
function createSpacialTree(
        s: number, 
        circles: Circle[]) {

    let coordinate = 0;
    let limits = [[0, width], [0, height]];

    let tree: TTree = { trees: new Map(), circles: new Set() };

    for (let circle of circles) {
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
