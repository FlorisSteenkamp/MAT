/** @hidden */
declare var _debug_: Debug;

import { LlRbTree } from 'flo-ll-rb-tree';
import { Debug } from '../../debug/debug.js';
import { Loop } from '../../loop.js';
import { CpNode } from '../../cp-node.js';
import { IPointOnShape } from '../../point-on-shape.js';
import { getShapeBounds } from '../../svg/get-shape-bounds.js';
import { Circle } from '../../circle.js';
import { find2Prong } from './find-2-prong/find-2-prong.js';
import { add2Prong } from './add-2-prong.js';


/**
 * @hidden
 * Find and add two-prongs.
 * @param loops 
 * @param cpGraphs 
 * @param k 
 * @param for2Prongs 
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd2Prongs(
        loops: Loop[],
        cpGraphs: Map<Loop,LlRbTree<CpNode>>,
        k: number, 
        for2Prongs: IPointOnShape[],
        extreme: number) {

    let len = for2Prongs.length;
    let index = indexLinear(len); 
    //let index = indexInterlaced(len); // Keep for possible future use.
    let cpNode_;

    let bounds = getShapeBounds(loops);
    let squaredDiagonalLength = 
        (bounds.maxX.p[0] - bounds.minX.p[0])**2 +
        (bounds.maxY.p[1] - bounds.minY.p[1])**2;

    for (let i=0; i<len; i++) {
        let pos = for2Prongs[index[i]];

        let twoProngInfo: { circle: Circle,	zs: { pos: IPointOnShape, d: number }[] };

        twoProngInfo = find2Prong(
            loops, extreme, squaredDiagonalLength, cpGraphs, pos, false, k
        );

        if (twoProngInfo) {
            let { circle, zs } = twoProngInfo;
            let cpNode = add2Prong(cpGraphs, circle, pos, zs, false, extreme);
            cpNode_ = cpNode_ || cpNode;
        }

        if (typeof _debug_ !== 'undefined') {
            if (i+1 === _debug_.directives.stopAfterTwoProngsNum) {
                return undefined;
            }
        }
    }

    return cpNode_;
}


/**
 * @hidden
 * Simple linear array indexing.
 * @param n
 */
function indexLinear(n: number) {
	let arr = [];
	for (let i=0; i<n; i++) {
		arr.push(i);
	}
	
	return arr;
}


/**
 * @hidden
 * Creates a kind of interlaced index vector.
 * @param n
*/
function indexInterlaced(n: number) {
	let source: { [index:number]: boolean } = {};
	let arr = [];
	// l is the lowest power of 2 so that 2^l > n
	let l = Math.pow(2, Math.floor(Math.log2(n)));
	
	while (l >= 1) {
		let k = 0;
		while (k < n) {
			if (!source[k]) {
				arr.push(k);
				source[k] = true;
			}
			k = k + l; 
		}
		l = l/2;
	}
	
	return arr;
}


export { findAndAdd2Prongs }
