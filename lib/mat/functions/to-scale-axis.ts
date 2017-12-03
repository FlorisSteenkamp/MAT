
import Circle         from '../../geometry/classes/circle';
import copyMat        from './copy-mat';
import getNodesAsHash from './get-nodes-as-hash';
import Geometry       from '../../geometry/geometry';
import PointOnShape   from '../../geometry/classes/point-on-shape';
import MatTree        from '../classes/mat-tree';
import MatNode        from '../classes/mat-node';

// TODO - fix highly convoluted typescript typings by modifiying code so that 
// a tree node (i.e. TTree type) does not use type union

const width  = 1620; // TODO change to actual shape coordinates
const height = 1560; // ...

type TTree = { [index:number]: TTree } | Map<string, MatNode>;

type TMatNodeInclPrior = { 
    satNode: MatNode, 
    priorNode: MatNode 
};

type TExtraParams = { 
    s: number, 
    tree: TTree, 
    cullHash: { [index:string]: MatNode }
} 



/**
 * Apply the Scale Axis Transform (SAT) to the MAT.
 * 
 * @param mat_ - The Medial Axis Transform (MAT) on which to apply the SAT. 
 * @param s - The scale factor >= 1 (e.g. 1.3)
 * @returns {MatTree}
 */
function toScaleAxis(mat_: MatTree, s: number): MatTree {
     // TODO
     // This algorithm might be made somewhat faster by building tree to a depth 
     // where there is say less than 4 other circles and then only split the 
     // branch once this threshold has been exceeded.
     // 
     // Also, when searching, search only in relevant branches even when circle 
     // overlaps more than one group.
	

	let mat = copyMat(mat_);
	// Start with the biggest circle (since it is the most likely to eclipse 
    // other circles), multiply its radius by s and see which circles are fully 
    // contained in it and trim it away in the MAT tree.
	
	let nodeHash = getNodesAsHash(mat);
	
	let biggest = -Number.POSITIVE_INFINITY;
	let biggestNode;
	for (let key in nodeHash) {
		let node = nodeHash[key]; 
		let r = node.matCircle.circle.radius; 
		if (r > biggest) {
			biggestNode = node;
			biggest = r;
		}
	}
	
	
	let tree: TTree = createSpacialTree(s, nodeHash);
	
	if (typeof window !== 'undefined' && (<any>window)._debug_) {
        const _debug_ = (<any>window)._debug_;
		/*
		if (FloMat._debug_.shouldDrawSATTree) {
			FloMat._debug_.drawSATTree(tree);
		}
		*/
		_debug_.generated.sat.tree = tree;
	}
	
	// Grab the MAT tree at its biggest node.
	let sat = new MatTree(biggestNode);

	let cullHash = {};
	
	// Look at circles in roughly order of size for each tree branch,
	// e.g. circles in branch 5 are always larger than in branches 0
	// to 4.
	traverseSpacialTree(tree, cullem, { s, tree, cullHash });
	
	// We now walk the MAT tree and keep all non-culled nodes and any
	// nodes that have a non-culled node further down the line toward
	// the tree leaves.
	let cullNodes: TMatNodeInclPrior[] = [];
	cullIt(cullHash, cullNodes, sat.startNode);
	 
	cullTheNodes(cullNodes);
	
	if (typeof window !== 'undefined' && (<any>window)._debug_) {
        const _debug_ = (<any>window)._debug_;
		_debug_.generated.timing.afterSat = performance.now(); 
	}
	
	return sat;
}


function addToTree(
        s: number, 
        tree: TTree, 
        coordinate: number, 
        limits: number[][], 
        node: MatNode, 
        key: string, 
        depth: number) {

	// DEPTH_LIMIT can be anything from 1 to 16, but from 2 to 6 seem 
	// to be the fastest.
	const DEPTH_LIMIT = 6;
	
	
	let circle = node.matCircle.circle; 
	
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
    
    
	if (!(tree as { [index:number]: TTree })[5]) { (((tree as { [index:number]: TTree })[5]) as Map<string, MatNode>) = new Map(); }
	let branch = (((tree as { [index:number]: TTree })[5]) as Map<string, MatNode>);
    branch.set(key, node);
}


function createSpacialTree(
        s: number, 
        nodeHash: { [index:string]: MatNode }): TTree {

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


function cullem(
        node: MatNode, 
        key: string, 
        extraParams: TExtraParams) {
    
    let { s, tree, cullHash } = extraParams;

	if (node.matCircle.circle.radius === 0) {
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


function traverseSpacialTree(
        tree: TTree, 
        f: (node: MatNode, key: string, extraParams: TExtraParams) => void, 
        extraParams: TExtraParams) {
	
	function helper(tree: TTree) {
		if (!tree) { return; }
		
		if ((tree as Map<string,MatNode>).size) {
			(tree as Map<string,MatNode>).forEach(function(node: MatNode, key: string) {
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


function getCullNodes(
        s: number, 
        tree: TTree, 
        testNode: MatNode) {
	
	let c1 = Circle.scale(testNode.matCircle.circle, s);
	
	let cullNodes: { [index:string]: MatNode } = {};
	
	let limits = [[0, width], [0, height]];
	let circle = testNode.matCircle.circle;
	helper(tree, 0, limits, 0);
	
	return cullNodes;
	
	
	function cullBranch5(tree: { [index:number]: TTree }) {
		let branch = tree[5] as Map<string,MatNode>;
		if (!branch) { return; }
        
		branch.forEach(function(node, key) {
			let c2 = Circle.scale(node.matCircle.circle, s);
			if (Circle.engulfsCircle(c1, c2)) {
				cullNodes[key] = node;
				
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


/**
 * Modifies cullNodes by adding nodes that potentially need to be called. 
 * Returns true if a node should NOT be culled, false otherwise. 
 */		
function cullIt(
        cullHash: { [index:string]: MatNode }, 
        cullNodes: TMatNodeInclPrior[], 
        satNode: MatNode, 
        priorNode?: MatNode) {

	let key = PointOnShape.makeSimpleKey(satNode.matCircle.circle.center);
	
	let anyNotCull = !cullHash[key];

	for (let node of satNode.branches) {
		if (node === priorNode) { continue; }

		if (cullIt(cullHash, cullNodes, node, satNode)) {
			anyNotCull = true;
		}
	}
			
	if (anyNotCull) {
		return true; // Don't cull me
	}
	
	cullNodes.push({ satNode, priorNode });
	
	return false;
}


function cullTheNode(cullNode: TMatNodeInclPrior) {
	let { satNode, priorNode } = cullNode;

	let idx = priorNode.branches.indexOf(satNode);
	if (idx >= 0) {
		priorNode.branches.splice(idx, 1);	
	}
}


function cullTheNodes(cullNodes: TMatNodeInclPrior[]) {
	for (let node of cullNodes) {
		cullTheNode(node);
	}
}


/**
 * Spacially divide into 5 special groups as follows:
 * 
 *   *******||*******|*******|*******|*******||*******
 * 0 <--------------->
 * 1         <--------------->        
 * 2                 <--------------->
 * 3                         <--------------->
 * 4                                 <--------------->
 * 5 - If the circle does not fall in any of above 5 groups.
 * 
 * Note: In the above, the double pipes denote the limits for
 *       a coordinate, so as can be seen groups 0 and 4 go outside
 *       the limits. Also, groups 1 and 3 are preferred and checked
 *       first. 
 *          
 * @param s Scale parameter, e.g. 1.1
 * @param coordinate - 0 -> horizontal or 1 -> vertical.
 * @param limits - The limits within which the circle bounds can fall.
 * @param circle - The circle to categorize into a group. 
 */
function calcGroups(
        s: number, 
        coordinate: number, 
        limits: number[][], 
        circle: Circle) {
	
	let limit = limits[coordinate];
	let l1 = limit[0];
	let l2 = limit[1];
	
	// Relevant cut-off lines.
	let q = (l2 - l1) / 4;
	let w = q+q;
	
	// Shift origin
	let r = circle.radius;
	let x = circle.center[coordinate] - l1;
	let x0 = x - (r * s);
	let x1 = x + (r * s); 

	let newLimit: number[] = [,];
	let groups = []; // Group to which circle belongs;

	
	/* This was the old method to get groups and newLimit, but it
	 * seems to be only slightly slower so could also be used
	let is = [1,3,0,2,4]; // Groups 1 and 3 takes priority. 
	for (let i=0; i<=4; i++) {
		let q0 = q*(is[i]-1);
		let q1 = q0 + w;
		if (x0 > q0 && x1 <= q1) {
			groups.push(is[i]);
			newLimit = [l1 + q0, l1 + q1];
			break;
		}
	}*/
	
	let qStart = Math.floor(x0/q);
	let qEnd   = Math.floor(x1/q) + 1;
	let qDiff  = qEnd - qStart; 
	
	let group;
	if (qDiff === 1) {
		// If contained in sliver.
		group = (2 * Math.floor(qStart/2)) + 1;
		groups.push(group);
		
		let lowerLimit = l1 + q*(group-1); 
		newLimit = [lowerLimit, lowerLimit + w];			
		
	} else if (qDiff === 2) {
		group = qStart + 1;
		groups.push(group);
		
		let lowerLimit = l1 + q*(group-1); 
		newLimit = [lowerLimit, lowerLimit + w];
	}
	
	let newLimits: number[][] = [,];
	if (groups.length === 1) {
		let otherCoordinate = coordinate ? 0 : 1; 
		
		newLimits[otherCoordinate] = limits[otherCoordinate];
		newLimits[coordinate] = newLimit;
	} 
	
	return { groups, newLimits };
}


export default toScaleAxis;