import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { Circle } from '../geometry/circle.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { createPos } from '../point-on-shape/create-pos.js';
import { getCloseByCpIfExist } from '../mat/get-closeby-cp-if-exist.js';
import { MatMeta } from '../mat/mat-meta.js';
import { insertCpNode } from '../cp-node/fs/insert-cp-node.js';
import { addToCpTree } from '../mat/add-to-cp-tree.js';
import { removeCpNode } from '../cp-node/fs/remove-cp-node.js';


/**
 * @internal
 * Adds a 2-prong contact circle to the shape.
 *
 * @param cpTrees
 * @param circle Circle containing the 2 contact points
 * @param posSource The source point on shape
 * @param posAntipode The found antipodal point on shape
 * @param isHoleClosing True if this is a hole-closing 2-prong, false otherwise
 * @param maxCoordinate The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function add2Prong(
		meta: MatMeta,
        circle: Circle,
		poss: PointOnShape[],
		isHoleClosing: boolean): CpNode | undefined {

	const { cpTrees } = meta;

	poss[0] = poss[0].t === 0
		? createPos(poss[0].curve.prev, 1, true)
		: poss[0];

	const orders = poss.map(pos => calcPosOrder(circle, pos));

	// Make sure there isn't already a ContactPoint close by - it can cause
	// floating point stability issues.
	for (let i=0; i<poss.length; i++) {
		if (!!getCloseByCpIfExist(meta, poss[i], circle, orders[i], 0, 2)) {
			return undefined;
		}
	}

	const { anyFailed, cpNodes } = addToCpTree(isHoleClosing, isHoleClosing, circle, orders, cpTrees, poss);

	if (anyFailed) {
		cpNodes.forEach(cpNode => {
			if (cpNode !== undefined) {
				removeCpNode(cpNode, cpTrees);
			}
		});
		return undefined;
	}

	// Get points ordered according to their angle with the x-axis
	// joinSpokes(circle, cpNodes);

	if (isHoleClosing) { 
		closeHole(cpTrees, cpNodes as CpNode[]);
	}

	return cpNodes[0];  // return the source `CpNode`
}


function closeHole(
		cpTrees: Map<Loop, LlRbTree<CpNode>>,
		cpNodes: CpNode[]) {

	const [cpNodeA, cpNodeB] = cpNodes;
	// Duplicate ContactPoints
	// const antipodeCpNode = cpNodeB[0];
	const cpAntipode = cpNodeB.cp;

	const cpNodeB2 = insertCpNode(
		true,
		true, false,
		cpTrees.get(cpAntipode.pointOnShape.curve.loop)!,
		{ ...cpAntipode, order2: +1 },
		cpNodeB
	)!;

	const cpNodeB1 = insertCpNode(
		true,
		true, false,
		cpTrees.get(cpNodeA.cp.pointOnShape.curve.loop)!,
		{ ...cpNodeA.cp, order2: -1 },
		cpNodeA.prev
	)!;

	// Connect graph
	cpNodeB1.prevOnCircle = cpNodeB2;
	cpNodeB1.nextOnCircle = cpNodeB2;
	cpNodeB2.prevOnCircle = cpNodeB1;
	cpNodeB2.nextOnCircle = cpNodeB1;

	cpNodeB.next = cpNodeA;
	cpNodeA.prev = cpNodeB;

	cpNodeB1.next = cpNodeB2;
	cpNodeB2.prev = cpNodeB1;
}


export { add2Prong }
