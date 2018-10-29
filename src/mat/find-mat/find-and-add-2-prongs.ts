
declare var _debug_: MatDebug;

import { MatDebug } from '../../debug/debug';

import LlRbTree from 'flo-ll-rb-tree';

import { Loop } from "../../loop";
import { CpNode } from '../../cp-node';
import { PointOnShape } from '../../point-on-shape';
import { getShapeBounds } from '../../svg/fs/get-shape-bounds';
import { Circle } from '../../circle';
import { find2Prong } from './find-2-prong/find-2-prong';
import { add2Prong } from './add-2-prong';


/**
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
        for2Prongs: PointOnShape[],
        extreme: number) {

    let len = for2Prongs.length;
    let index = indexLinear(len); // Keep for possible future use.
    //let index = indexInterlaced(len);
    let cpNode_;

    let bounds = getShapeBounds(loops);
    let squaredDiagonalLength = 
        (bounds.maxX.p[0] - bounds.minX.p[0])**2 +
        (bounds.maxY.p[1] - bounds.minY.p[1])**2;

    //console.log(Math.sqrt(squaredDiagonalLength));

    for (let i=0; i<len; i++) {
        let pos = for2Prongs[index[i]];

        //let twoProngInfo: { circle: Circle,	z: PointOnShape };
        /*if (i === 15) {
            console.log('stop')
        }*/

        let twoProngInfo: { circle: Circle,	zs: { pos: PointOnShape, d: number }[] };
        twoProngInfo = find2Prong(
            loops, extreme, squaredDiagonalLength, cpGraphs, pos, false, k
        );

        if (twoProngInfo) {
            let { circle, zs } = twoProngInfo;
            let cpNode = add2Prong(cpGraphs, circle, pos, zs, false, extreme);

            // TODO - below should certainly be explained
            if (!cpNode_ && cpNode) { cpNode_ = cpNode; }
        }/* else {
            console.log('aaaaaaaaa')
        }*/

        if (typeof _debug_ !== 'undefined') {
            if (i+1 === _debug_.directives.stopAfterTwoProngsNum) {
                return undefined;
            }
        }
    }

    return cpNode_;
}


/**
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
