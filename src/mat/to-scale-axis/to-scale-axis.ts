
import { CpNode } from '../../cp-node';
import { Circle } from '../../circle';
import { Mat    } from '../../mat';

import { getVerticesAsArray  } from '../get-vertices-as-array';

import { getLargestVertex    } from './get-largest-vertex';
import { createSpacialTree   } from './create-spacial-tree';
import { traverseSpacialTree } from './traverse-spacial-tree';
import { cull                } from './cull';
import { getEngulfedVertices } from './get-engulfed-vertices';
import { addDebugInfo        } from './add-debug-info';
import { createNewCpTree     } from './create-new-cp-tree';


/**
 * Note: Use toEnhancedScaleAxis instead - it is faster and better.
 * Apply the Scale Axis Transform (SAT) to the MAT.
 * @param mat - The Medial Axis Transform (MAT) on which to apply the SAT. 
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
function toScaleAxis(mat: Mat, s: number) {		
	//--------------------------------------------------------------------------
	// Start with the biggest circle (since it is the most likely to eclipse 
    // other circles), multiply its radius by s and see which circles are fully 
	// contained in it and trim it away in the MAT tree.
	//--------------------------------------------------------------------------

	let cpNodes = getVerticesAsArray(mat.cpNode.clone()); 
	let cpNode = getLargestVertex(cpNodes);
	let circles = cpNodes.map(cpNode => cpNode.cp.circle);
	let tree = createSpacialTree(s, circles);
	let culls: Set<Circle> = new Set();
	traverseSpacialTree(tree, circle => {
		if (circle.radius === 0 || culls.has(circle)) {	return; }

		getEngulfedVertices(s, tree, circle)
			.forEach(circle => culls.add(circle));
	});
	
	cull(culls, cpNode);
	
	addDebugInfo(cpNode);

	return new Mat(cpNode, createNewCpTree(cpNode));
}


export { toScaleAxis };


// TODO
// This algorithm might be made somewhat faster by building tree to a depth 
// where there is say less than 4 other circles and only then split the 
// branch once this threshold has been exceeded.
// 
// Also, when searching, search only in relevant branches even when circle 
// overlaps more than one group.