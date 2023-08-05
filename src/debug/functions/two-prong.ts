declare let _debug_: Debug; 

import { drawFs } from 'flo-draw';
import { getObjClosestTo, distanceBetween, squaredDistanceBetween } from 'flo-vector2d';
import { Debug, Generated } from '../debug.js';
import { CpNode } from '../../cp-node/cp-node.js';
import { Circle } from '../../geometry/circle.js';
import { TwoProngForDebugging } from '../two-prong-for-debugging.js';
import { ElemType_TwoProng } from '../../mat/elem-type-two-prong.js';


/** @internal */
interface ITwoProngDebugFunctions {
	logδ       : (n: number, type?: ElemType_TwoProng) => void,
	log        : (n: number, type?: ElemType_TwoProng) => void,
	drawNormal : typeof drawNormal,
	logδBasic  : (n: number) => void,
	logNearest : (
		showSpokes?     : boolean,
		showTrace?      : boolean,
		showBoundaries? : boolean
	) => (g: SVGGElement, p: number[], showDelay?: number, scale?: number) => void,
	traceConvergence: typeof traceConvergence,
}


/**
 * @internal
 */
function logδ(n: number, type: ElemType_TwoProng = 'twoProng_regular') {
	const δ =_debug_.generated.elems[type][n].δ;
	
	console.log(δ);
}


/**
 * @internal
 */
function log(n: number, type: ElemType_TwoProng = 'twoProng_regular') {
	const twoProng = _debug_.generated.elems[type][n];
	console.log(twoProng);
}


/**
 * @internal
 */
function drawNormal(
		g: SVGGElement,
		twoProng: TwoProngForDebugging, 
		showDelay = 1000) {

	drawFs.line(
		g, [twoProng.pos.p, twoProng.circle.center], 'thin10 blue', showDelay
	);
}


/**
 * @internal
 */
function logδBasic(
		n: number, 
		type: ElemType_TwoProng = 'twoProng_regular') {

	const delta = _debug_.generated.elems[type][n].δ;

	function logδBasic_(x: CpNode) {
		const pos = x.cp.pointOnShape;
		return {
			bez: pos.curve.ps,
			t: pos.t
		}
	}
	
	console.log(logδBasic_(delta[0]));
	console.log(logδBasic_(delta[1]));
}


/**
 * @internal
 * Draws 3 lines from the given 3-prong center to its 3 contact points.
 * @param n - The 3-prong's zero-based index. 
 */
function drawSpokes(
        g: SVGGElement,
        twoProng: TwoProngForDebugging,
        showDelay = 1000): void {

	const cc = twoProng.circle.center;
	const { pos, circle, cpNode, xs, z, δ } = twoProng;
    
	drawFs.line(g, [pos.p, cc], 'thin5 red', showDelay);
    drawFs.line(g, [z, cc], 'thin5 red', showDelay);
}


/**
 * @internal
 */
function logNearest(
        showSpokes?: boolean,
		showTrace?: boolean,
		showBoundaries?: boolean) {
            
    return (g: SVGGElement,
			p: number[],
			showDelay = 1000,
			scale = 1) => {
				
		const closestPerLoops: TwoProngForDebugging[] = [];

		const generated = _debug_.generated;
		const twoProng = getObjClosestTo<TwoProngForDebugging>(
			p, 
			// generated.elems[type], 
			generated.elems['twoProng_regular'],
			twoProng => twoProng.circle.center
		)!;
		closestPerLoops.push(twoProng!);

		console.log(twoProng);
		
		let n;
		//for (let i=0; i<_debug_.generated.elems[type].length; i++) {
		//	const twoProng_ = _debug_.generated.elems[type][i];
		for (let i=0; i<_debug_.generated.elems['twoProng_regular'].length; i++) {
			const twoProng_ = _debug_.generated.elems['twoProng_regular'][i];
			if (twoProng_ === twoProng) {
				n = i;
				break;
			}
		}

        if (showSpokes) {
            drawSpokes(g, twoProng, showDelay)
        }
		
		if (n !== undefined && showTrace) {
			traceConvergence(g, twoProng, showDelay, scale);
		}
	}
}


/**
 * @internal
 * @param n - The 2-prong's zero-based index.
 * @param range
 */
function traceConvergence(
		g: SVGGElement, 
		twoProng: TwoProngForDebugging, 
		showDelay = 1000,
		scale = 1) {

	const xs = twoProng.xs;

	console.log(twoProng);
	console.log(
		twoProng.xs.map(x => ({
				x: x.x,
				y: x.y,
				z: x.z, 
				d: x.z ? squaredDistanceBetween(x.y.p, x.z.p) : 0,
				t: x.t,
			})
		)
	);

    console.log(xs.length)
	for (let i=0; i<xs.length; i++) {
		const x = twoProng.xs[i];

		const circle = { center: x.x, radius: distanceBetween(x.x, x.y.p) };
		drawFs.crossHair(g, x.x, 'red thin10 nofill', 0.002*scale, showDelay);
		drawFs.circle(g, circle, 'blue thin10 nofill', showDelay);
		if (x.z !== undefined) {
			drawFs.crossHair(
				g, x.z.p, 'yellow thin10 nofill', 0.001*scale, showDelay
			);
		}
	}

	// twoProngDebugFunctions.drawNormal(g, twoProng, showDelay);
}


/** @internal */
const twoProngDebugFunctions: ITwoProngDebugFunctions = {
	logδ,
	log,
	drawNormal,
	logδBasic,
	traceConvergence,
	logNearest,	
}


export { ITwoProngDebugFunctions, twoProngDebugFunctions };
	
