import { CpNode } from '../cp-node/cp-node.js';
import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { find3Prong } from './find-3-prong.js';
import { MatMeta } from '../mat/mat-meta.js';
import { addToCpTree } from '../mat/add-to-cp-tree.js';
import { getCloseByCpIfExist } from '../mat/get-closeby-cp-if-exist.js';
import { getRealProngCount } from '../cp-node/fs/get-real-prong-count.js';
import { removeVertex } from '../vertex/remove-vertex.js';
import { getProngCount } from '../cp-node/fs/get-prong-count.js';


/**
 * @internal
 * Finds and add a 3-prong MAT circle to the given shape.
 * @param cpTrees
 * @param visitedCps
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd3Prong(
		meta: MatMeta,
		visitedCps: CpNode[]) {
	
	const δs: [CpNode, CpNode][] = [];
	for (const visitedCp of visitedCps) {
		δs.push([visitedCp, visitedCp.next]);
	}
	
	const threeProngInfo = find3Prong(δs, meta.maxCoordinate);

	const { circle, poss, δ3s } = threeProngInfo;
	
	const orders: number[] = [];
	for (let i=0; i<3; i++) {
		orders.push(calcPosOrder(circle, poss[i]));
	}

	const closeBysFor3Prong: CpNode[] = [];
	for (let i=0; i<poss.length; i++) {
		const pos = poss[i];
		const order = orders[i];
		const closeBy = getCloseByCpIfExist(meta, pos, circle, order, 0, 3);
		if (closeBy !== undefined) {
			const prongCount = getProngCount(closeBy);
			if (prongCount <= 2 && !closeBy.isHoleClosing) {
				closeBysFor3Prong.push(closeBy);
			}
		}
	}

	const cpNodes = closeBysFor3Prong.length === 0
		? addToCpTree(
			true, false, circle, orders, meta.cpTrees, poss, δ3s.map(v => v[0])
		).cpNodes
		: [];

	return { closeBysFor3Prong, cpNodes: cpNodes as CpNode[] };
}


export { findAndAdd3Prong }
