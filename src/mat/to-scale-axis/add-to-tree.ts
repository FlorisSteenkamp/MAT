import { Circle } from '../../circle.js';
import { calcGroups } from './calc-groups.js';
import { TTree } from './t-tree.js';


// DEPTH_LIMIT can be anything from 1 to 16, but from 2 to 6 seem to be the 
// fastest.
/** @hidden */
const DEPTH_LIMIT = 6;

/**
 * @hidden
 * @param s 
 * @param tree 
 * @param coordinate 
 * @param limits 
 * @param circle 
 * @param depth 
 */
function addToTree(
    s: number, 
    tree: TTree, 
    coordinate: number, 
    limits: number[][], 
    circle: Circle,
    depth: number) {

    let { groups, newLimits } = calcGroups(
        s,
        coordinate, 
        limits, 
        circle
    );

    // Create new edge if it does not exist yet.
    if (groups.length === 1 && depth !== DEPTH_LIMIT) {
        let group = groups[0]; 
        
        if (!tree.trees.get(group)) { 
            tree.trees.set(group, { trees: new Map(), circles: new Set() } ); 
        }	
        let t = tree.trees.get(group);
        
        // Flip coordinates
        let newCoordinate = coordinate ? 0 : 1; 
        addToTree(
            s,
            t, 
            newCoordinate, 
            newLimits, 
            circle, 
            depth+1
        );
        
        return;
    }

    if (!tree.trees.get(5)) { 
        tree.trees.set(5, { trees: new Map(), circles: new Set() } );
    }
    let vertices = tree.trees.get(5).circles;
    vertices.add(circle);
}


export { addToTree }
