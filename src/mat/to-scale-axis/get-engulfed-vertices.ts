import { Circle, scaleCircle, engulfsCircle } from '../../circle.js';
import { TTree } from './t-tree.js';
import { calcGroups } from './calc-groups.js';


/** @hidden */
const width  = 1620; // TODO change to actual shape coordinates
/** @hidden */
const height = 1560; // ...


/**
 * @hidden
 * Returns a map of engulfed MAT nodes determined to be engulfed by the given
 * test node and scale factor and starting from the given spacial tree node.
 * @param s The scale factor
 * @param tree The spacial tree node from where to start
 * @param circle The circle potentially engulfing other nodes
 */
function getEngulfedVertices(
        s: number, 
        tree: TTree, 
        circle: Circle) {

    let c1 = scaleCircle(circle, s);

    let cullNodes: Set<Circle> = new Set();

    let limits = [[0, width], [0, height]];
    f(tree, 0, limits, 0);

    return cullNodes;


    function cullBranch5(tree: TTree) {
        let t = tree.trees.get(5);
        if (!t) { return; }

        let circles = t.circles;
        
        circles.forEach(function(circle, key) {
            let c2 = scaleCircle(circle, s);
            if (engulfsCircle(c1, c2)) {
                cullNodes.add(circle);
                circles.delete(key);
            }					
        });
    }

    
    function f(
            tree: TTree, 
            coordinate: number, 
            limits: number[][], 
            depth: number) {
        
        if (limits === null) {
            // If we already reached a circle which spans multiple groups 
            // previously, then check all circles in the tree.
            cullBranch5(tree);
            
            for (let i=0; i<=4; i++) {
                let t = tree.trees.get(i);
                if (t) {
                    f(t, 0, null, depth+1);
                }
            }
            
            return;
        }
        
        let { groups, newLimits } = calcGroups(
                s, 
                coordinate, 
                limits, 
                circle
        );
        
        if (groups.length === 1) {
            cullBranch5(tree);
            
            let group = groups[0];
            let newCoordinate = coordinate ? 0 : 1;
            
            if (group === 1 || group === 3) {
                // One of the higher priority left/top or 
                // right/bottom half groups.
                let t = tree.trees.get(group);
                
                if (t) {
                    f(
                            t, 
                            newCoordinate, 
                            newLimits, 
                            depth+1
                    );
                }
            } else {
                // One of the lower priority even groups (0,2 or 4).
                
                let branches = [];
                branches.push(tree.trees.get(group));
                if (group > 0) { branches.push(tree.trees.get(group-1)); }
                if (group < 4) { branches.push(tree.trees.get(group+1)); }
                
                for (let branch of branches) {
                    if (branch) {
                        f(
                                branch, 
                                newCoordinate, 
                                newLimits, 
                                depth+1
                        );
                    }
                }
            }
            
            return;
        } 
        

        cullBranch5(tree);
        // Circle spans multiple groups at this level of the tree. Check all 
        // circles in all branches.
        for (let i=0; i<=4; i++) {
            let t = tree.trees.get(i);
            if (!t) { continue; }
            
            f(t, 0, null, depth+1);
        }
    }
}


export { getEngulfedVertices }
