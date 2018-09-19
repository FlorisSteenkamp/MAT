"use strict";
// Axis Measure Scale Axis Transform (AMSAT)
Object.defineProperty(exports, "__esModule", { value: true });
const flo_memoize_1 = require("flo-memoize");
const point_on_shape_1 = require("../../classes/point-on-shape");
const mat_node_1 = require("../../classes/mat-node");
const get_mat_circles_as_hash_1 = require("../../functions/get-mat-circles-as-hash");
const get_mat_nodes_as_array_1 = require("../get-mat-nodes-as-array");
const flo_vector2d_1 = require("flo-vector2d");
let { m1: memoize } = flo_memoize_1.default;
const width = 1620; // TODO change to actual shape coordinates
const height = 1560; // ...
////////// can be imported
function traverseNodes(node, f) {
    let visitedNodes = new Set();
    g(node);
    function g(matNode) {
        if (!matNode.deleted) {
            f(matNode);
        }
        for (let branch of matNode.branches) {
            if (visitedNodes.has(branch.matNode)) {
                continue; // We already visited this branch.
            }
            visitedNodes.add(branch.matNode);
            g(branch.matNode);
        }
    }
}
function amsat(mat_, s) {
    let mat = mat_node_1.MatNode.copy(mat_);
    let matNodes = get_mat_nodes_as_array_1.getMatNodesAsArray(mat);
    // Get MatNodes as an array sorted by scaled engulfing radius.
    let matNodeInfos = matNodes
        .map(function (matNode) {
        return { node: matNode, r: s * matNode.matCircle.circle.radius };
    })
        .sort(function (a, b) {
        return a.r - b.r;
    });
    // Also create a map that maps each MatNode to a corresonding MatNodeInfo.
    let matNodeInfoMap = new Map();
    matNodeInfos.forEach(function (matNodeInfo) {
        matNodeInfoMap.set(matNodeInfo.node, matNodeInfo);
    });
    // In descending engulfing radius check each node if it engulfs its 
    // neighbors and mark it as such, also possibly updating the neighbors'
    // engulfing radius.
    for (let i = 0; i < matNodeInfos.length; i++) {
        let matNodeInfo = matNodeInfos[i];
        let matNode = matNodeInfo.node;
        let branches = matNode.branches;
        for (let branch of branches) {
            let branchInfo = matNodeInfoMap.get(branch.matNode);
            let branchMatNode = branchInfo.node;
            let branchR = branchInfo.r;
            let r = s * matNode.matCircle.circle.radius;
            // TODO - l must be the bezier length connecting the mat circle
            // centers and not the straight line length.
            let branchCC = branch.matCircle.circle.center;
            let cc = matNode.matCircle.circle.center;
            let l = flo_vector2d_1.distanceBetween(branchCC, cc);
            if (r > l + branchR) {
                branchInfo.r = r - l;
                //markAsCull(branchMatNode);
            }
        }
    }
    /*
    let cullHash = {};

    let cullNodes: TMatCircleInclPrior[] = [];
    cullIt(cullHash, cullNodes, sat.startNode);
     
    cullTheNodes(cullNodes);
    
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.afterSat = performance.now();
        _debug_.sats.push(sat);
    }
    
    return sat;
    */
    return undefined;
}
/**
 * Returns the Axis Measure Scale Axis Transform (AMSAT) of the Medial Axis
 * Transform (MAT). Unlike the Scale Axis Transform (SAT) the AMSAT is a subset
 * of the MAT.
 * @param mat_ - The Medial Axis Transform (MAT) on which to apply the AMSAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
function toAMScaleAxis(mat_, s) {
    let mat = mat_node_1.MatNode.copy(mat_);
    let nodeHash = get_mat_circles_as_hash_1.getMatCirclesAsHash(mat);
    let biggest = -Number.POSITIVE_INFINITY;
    let biggestCircle;
    for (let key in nodeHash) {
        let matCircle = nodeHash[key];
        let r = matCircle.circle.radius;
        if (r > biggest) {
            biggestCircle = matCircle;
            biggest = r;
        }
    }
    //let tree: TTree = createSpacialTree(s, nodeHash);
    // Grab the MAT tree at its biggest node.
    let sat = biggestCircle.matNode;
    let cullHash = {};
    // Traverse and cull?
    //traverseSpacialTree(tree, cullem, { s, tree, cullHash });
    // We now walk the MAT tree and keep all non-culled nodes and any
    // nodes that have a non-culled node further down the line toward
    // the tree leaves.
    let cullNodes = [];
    cullIt(cullHash, cullNodes, sat);
    cullTheNodes(cullNodes);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.afterSat = performance.now();
        _debug_.sats.push(sat);
    }
    return sat;
}
exports.toAMScaleAxis = toAMScaleAxis;
/*
function addToTree(
        s: number,
        tree: TTree,
        coordinate: number,
        limits: number[][],
        //node: MatNode,
        node: MatCircle,
        key: string,
        depth: number) {

    // DEPTH_LIMIT can be anything from 1 to 16, but from 2 to 6 seem
    // to be the fastest.
    const DEPTH_LIMIT = 6;
    
    
    let circle = node.circle;
    
    let { groups, newLimits } = calcGroups(
            s,
            coordinate,
            limits,
            circle
    );
    
    // Create new branch if it does not exist yet.
    if (groups.length === 1 && depth !== DEPTH_LIMIT) {
        let group = groups[0];
        
        if (!(tree as { [index:number]: TTree })[group]) { (tree as { [index:number]: TTree })[group] = {}; }
        let branch = (tree as { [index:number]: TTree })[group];
        
        // Flip coordinates
        let newCoordinate = coordinate ? 0 : 1;
        addToTree(
                s,
                branch,
                newCoordinate,
                newLimits,
                node,
                key,
                depth+1
        );
        
        return;
    }
    
    
    if (!(tree as { [index:number]: TTree })[5]) { (((tree as { [index:number]: TTree })[5]) as Map<string, MatCircle>) = new Map(); }
    let branch = (((tree as { [index:number]: TTree })[5]) as Map<string, MatCircle>);
    branch.set(key, node);
}
*/
/*
function createSpacialTree(
        s: number,
        nodeHash: { [index:string]: MatCircle }): TTree {

    let coordinate = 0;
    let limits = [[0, width], [0, height]];
    
    let tree: TTree = {};
    
    for (let key in nodeHash) {
        let node = nodeHash[key];
        
        addToTree(
                s,
                tree,
                coordinate,
                limits,
                node,
                key,
                0
        );
    }
    
    return tree;
}
*/
/*
function cullem(
        node: MatCircle,
        key: string,
        extraParams: TExtraParams) {
    
    let { s, tree, cullHash } = extraParams;

    if (node.circle.radius === 0) {
        return;
    }

    if (cullHash[key]) {
        return;
    }
    
    let cullNodes = getCullNodes(s, tree, node);
    for (let key in cullNodes) {
        if (!cullHash[key]) {
            cullHash[key] = node;
        }
    }
}
*/
/*
function traverseSpacialTree(
        tree: TTree,
        //f: (node: MatNode, key: string, extraParams: TExtraParams) => void,
        f: (node: MatCircle, key: string, extraParams: TExtraParams) => void,
        extraParams: TExtraParams) {
    
    function helper(tree: TTree) {
        if (!tree) { return; }
        
        if ((tree as Map<string,MatCircle>).size) {
            (tree as Map<string,MatCircle>).forEach(function(node: MatCircle, key: string) {
                f(node, key, extraParams);
            });
            
            return; // Leaf reached
        }
        
        if ((tree as { [index:number]: TTree })[5]) { helper((tree as { [index:number]: TTree })[5]); }
        if ((tree as { [index:number]: TTree })[0]) { helper((tree as { [index:number]: TTree })[0]); }
        if ((tree as { [index:number]: TTree })[2]) { helper((tree as { [index:number]: TTree })[2]); }
        if ((tree as { [index:number]: TTree })[4]) { helper((tree as { [index:number]: TTree })[4]); }
        if ((tree as { [index:number]: TTree })[1]) { helper((tree as { [index:number]: TTree })[1]); }
        if ((tree as { [index:number]: TTree })[3]) { helper((tree as { [index:number]: TTree })[3]); }
    }
    
    helper(tree);
}
*/
/*
function getCullNodes(
        s: number,
        tree: TTree,
        testNode: MatCircle) {
    
    let c1 = Circle.scale(testNode.circle, s);
    
    let cullNodes: { [index:string]: MatNode } = {};
    
    let limits = [[0, width], [0, height]];
    let circle = testNode.circle;
    helper(tree, 0, limits, 0);
    
    return cullNodes;
    
    
    function cullBranch5(tree: { [index:number]: TTree }) {
        let branch = tree[5] as Map<string,MatCircle>;
        if (!branch) { return; }
        
        branch.forEach(function(node, key) {
            let c2 = Circle.scale(node.circle, s);
            if (Circle.engulfsCircle(c1, c2)) {
                cullNodes[key] = node.matNode;
                
                branch.delete(key);
            }
        });
    }

    function helper(
            tree: TTree,
            coordinate: number,
            limits: number[][],
            depth: number) {
        
        if (limits === null) {
            // If we already reached a circle which spans multiple groups
            // previously, then check all circles in the tree.
            cullBranch5(tree as { [index:number]: TTree });
            
            for (let i=0; i<=4; i++) {
                let branch = (tree as { [index:number]: TTree })[i];
                if (branch) {
                    helper(branch, 0, null, depth+1);
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
            cullBranch5(tree as { [index:number]: TTree });
            
            let group = groups[0];
            let newCoordinate = coordinate ? 0 : 1;
            
            if (group === 1 || group === 3) {
                // One of the higher priority left/top or
                // right/bottom half groups.
                let branch = (tree as { [index:number]: TTree })[group];
                
                if (branch) {
                    helper(
                            branch,
                            newCoordinate,
                            newLimits,
                            depth+1
                    );
                }
            } else {
                // One of the lower priority even
                // groups (0,2 or 4).
                
                let branches = [];
                branches.push((tree as { [index:number]: TTree })[group]);
                if (group > 0) { branches.push((tree as { [index:number]: TTree })[group-1]); }
                if (group < 4) { branches.push((tree as { [index:number]: TTree })[group+1]); }
                
                for (let branch of branches) {
                    if (branch) {
                        helper(
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
        

        cullBranch5(tree as { [index:number]: TTree });
        // Circle spans multiple groups at this level of the
        // tree. Check all circles in all branches.
        for (let i=0; i<=4; i++) {
            let branch = (tree as { [index:number]: TTree })[i];
            if (branch) {
                helper(branch, 0, null, depth+1);
            }
        }
    }
}
*/
/**
 * Modifies cullNodes by adding nodes that potentially need to be culled.
 * Returns true if a node should NOT be culled, false otherwise.
 */
function cullIt(cullHash, cullNodes, satNode, priorNode) {
    let key = point_on_shape_1.PointOnShape.makeSimpleKey(satNode.matCircle.circle.center);
    let anyNotCull = !cullHash[key];
    for (let node of satNode.branches) {
        if (node.matNode === priorNode) {
            continue;
        }
        if (cullIt(cullHash, cullNodes, node.matNode, satNode)) {
            anyNotCull = true;
        }
    }
    if (anyNotCull) {
        return true; // Don't cull me
    }
    cullNodes.push({ satCircle: satNode.matCircle, priorCircle: priorNode.matCircle });
    return false;
}
function cullTheNode(cullNode) {
    let { satCircle, priorCircle } = cullNode;
    let indx = -1;
    for (let i = 0; i < priorCircle.branches.length; i++) {
        let branch = priorCircle.branches[i];
        if (branch.matCircle === satCircle) {
            indx = i;
            break;
        }
    }
    if (indx >= 0) {
        priorCircle.branches.splice(indx, 1);
    }
}
function cullTheNodes(cullNodes) {
    for (let node of cullNodes) {
        cullTheNode(node);
    }
}
// 503 
