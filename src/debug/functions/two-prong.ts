
declare let _debug_: MatDebug; 

import { MatDebug, Generated } from '../debug';

import { CpNode } from '../../cp-node';
import { Circle } from '../../circle';

import { 
	getObjClosestTo, 
	distanceBetween, 
	squaredDistanceBetween 
} from 'flo-vector2d';

import { TwoProngForDebugging } from '../two-prong-for-debugging';
import { ElemType_TwoProng } from '../../mat/elem-type-two-prong';


interface ITwoProngDebugFunctions {
	logδ       : (n: number, type?: ElemType_TwoProng) => void,
	log        : (n: number, type?: ElemType_TwoProng) => void,
	drawNormal : (n: number, showDelay?: number) => void,
	logδBasic  : (n: number) => void,
	logNearest : (p: number[], showDelay?: number) => void,
	traceConvergence: (n: number, finalOnly?: boolean, showDelay?: number,
		range?: number[], type?: ElemType_TwoProng) => void,
}


/**
 * 
 */
function logδ(n: number, type: ElemType_TwoProng = 'twoProng_regular') {
	let δ =_debug_.generated.elems[type][n].δ;
	
	console.log(δ);
}


/**
 * 
 */
function log(n: number, type: ElemType_TwoProng = 'twoProng_regular') {
	let twoProng = _debug_.generated.elems[type][n];
	console.log(twoProng);
}


/**
 * 
 */
function drawNormal(
		n: number, 
		showDelay = 1000, 
		type: ElemType_TwoProng = 'twoProng_regular') {

	let twoProngs = _debug_.generated.elems[type];
	
	// If not specified which, draw all
	if (n === undefined) {
		for (let i=0; i<twoProngs.length; i++) {
			drawNormal(i);
		}
	}
	
	let twoProng = twoProngs[n];

	let g = twoProng.generated.g;
	
	if (!twoProng) { return; }
	
	_debug_.fs.draw.line(
		g, [twoProng.pos.p, twoProng.circle.center], 'thin10 blue', showDelay
	);
}


/**
 * 
 */
function logδBasic(
		n: number, 
		type: ElemType_TwoProng = 'twoProng_regular') {

	let delta = _debug_.generated.elems[type][n].δ;

	function f(x: CpNode) {
		let pos = x.cp.pointOnShape;
		return {
			bez: pos.curve.ps,
			t: pos.t
		}
	}
	
	console.log(f(delta[0]));
	console.log(f(delta[1]));
}


/**
 * 
 */
function logNearest(p: number[], showDelay = 1000, type: ElemType_TwoProng = 'twoProng_regular') {
	let closestPerLoops: TwoProngForDebugging[] = [];
	_debug_.generatedAll.forEach(function(generated, loops) {
		let twoProng = getObjClosestTo<TwoProngForDebugging>(
			p, 
			generated.elems[type], 
			twoProng => twoProng.circle.center
		);
		closestPerLoops.push(twoProng)
	});
	let twoProng = getObjClosestTo<TwoProngForDebugging>(
		p, 
		closestPerLoops, 
		twoProng => twoProng.circle.center
	);


	console.log(twoProng);
	
	let n;
	for (let i=0; i<_debug_.generated.elems[type].length; i++) {
		let twoProng_ = _debug_.generated.elems[type][i];
		if (twoProng_ === twoProng) {
			n = i;
			break;
		}
	}
	
	if (n !== undefined) { traceConvergence(n, true, showDelay); }
}


/**
 * 
 * @param n - The 2-prong's zero-based index.
 * @param range
 * cascade of convergence)
 */
function traceConvergence(
		n         : number, 
		finalOnly : boolean,
		showDelay = 1000,
		range     : number[] = undefined, 
		type      : ElemType_TwoProng = 'twoProng_regular') {

	if (n === undefined) { return; }

	let twoProngInfo = _debug_.generated.elems[type][n];
	let xs = twoProngInfo.xs;
	let g = twoProngInfo.generated.g;

	console.log(twoProngInfo);
	console.log(
		twoProngInfo.xs.map(x => ({
				x: x.x,
				y: x.y,
				z: x.z, 
				d: x.z ? squaredDistanceBetween(x.y.p, x.z.p) : 0,
				t: x.t,
			})
		)
	);

	for (let i=0; i<xs.length; i++) {
		if (range && (i < range[0] || i >= range[1])) {
			continue;
		}
		if (finalOnly && i !== xs.length-1) {
			continue;
		}

		let x = twoProngInfo.xs[i];

		let circle = new Circle(x.x, distanceBetween(x.x, x.y.p));
		_debug_.fs.draw.crossHair(g, x.x, 'red thin10 nofill', undefined, showDelay);
		_debug_.fs.draw.circle(g, circle, 'blue thin10 nofill', showDelay);
		if (x.z !== undefined) {
			_debug_.fs.draw.crossHair(
				g, x.z.p, 'yellow thin10 nofill', 2, showDelay
			);
		}
	}

	twoProngDebugFunctions.drawNormal(n, showDelay);
}


let twoProngDebugFunctions: ITwoProngDebugFunctions = {
	logδ,
	log,
	drawNormal,
	logδBasic,
	traceConvergence,
	logNearest,	
}


export { ITwoProngDebugFunctions, twoProngDebugFunctions };
	
