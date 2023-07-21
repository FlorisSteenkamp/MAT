/** @internal */
declare const _debug_: Debug;

import { LlRbTree } from 'flo-ll-rb-tree';
import { exponent } from 'big-float-ts';
import { Debug } from '../../../debug/debug.js';
import { Loop } from 'flo-boolean';
import { CpNode, insertCpNode } from '../../../cp-node/cp-node.js';
import { Circle } from '../../../circle.js';
import { ContactPoint } from '../../../contact-point.js';
import { PointOnShape } from '../../../point-on-shape/point-on-shape.js';
import { calcPosOrder } from '../../../point-on-shape/calc-pos-order.js';
import { createPos } from '../../../point-on-shape/create-pos.js';
import { isAnotherCpCloseby } from '../../is-another-cp-closeby.js';
import { getNeighbouringPoints } from '../../get-neighboring-cps.js';
import { TwoProngForDebugging } from '../../../debug/two-prong-for-debugging.js';
import { Curve } from '../../../curve.js';


/**
 * @internal
 * Adds a 2-prong contact circle to the shape.
 * @param cpGraphs
 * @param circle Circle containing the 2 contact points
 * @param posSource The source point on shape
 * @param posAntipode The found antipodal point on shape
 * @param holeClosing True if this is a hole-closing 2-prong, false otherwise
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function add2Prong(
		cpGraphs      : Map<Loop,LlRbTree<CpNode>>,
        circle        : Circle, 
        posSource     : PointOnShape, 
		posAntipodes  : { pos: PointOnShape, d: number }[],
		holeClosing   : boolean,
		extreme       : number): CpNode | undefined {

	let t_s = posSource.t;
	if (t_s === 0) {
		t_s = 1;
		posSource = createPos(posSource.curve.prev, t_s);
	}

	const orderSource = calcPosOrder(circle, posSource);
	const orderAntipodes = posAntipodes.map(
		posAntipode => calcPosOrder(circle, posAntipode.pos)
	);


	// Make sure there isn't already a ContactPoint close by - it can cause
	// floating point stability issues.
	// TODO - possibly combine n-prongs in this case

	let isCloseByAntipodes = false;
	for (let i=0; i<posAntipodes.length; i++) {
		const posAntipode = posAntipodes[i];
		const orderAntipode = orderAntipodes[i];

		if (!!isAnotherCpCloseby(cpGraphs, posAntipode.pos, circle, orderAntipode, 0, extreme)) {
			isCloseByAntipodes = true;
			break;
		}
	}
	if (!!isAnotherCpCloseby(cpGraphs, posSource, circle, orderSource, 0, extreme) ||
		isCloseByAntipodes) {

		if (typeof _debug_ !== 'undefined') {
			if (holeClosing) {
				_debug_.generated.elems['twoProng_holeClosing'].pop();
			} else {
				_debug_.generated.elems['twoProng_regular'].pop();
			}
		}
		return;
	}

	// Antipode
	const newCpAntipodes: CpNode[] = [];
	const cpAntipodes: ContactPoint[] = [];
	const cpTreeAntipodes: LlRbTree<CpNode>[] = [];
	const deltaAntipodes: CpNode[][] = [];
	const loopAntipodes: Loop[] = [];
	for (let i=0; i<posAntipodes.length; i++) {
		const posAntipode = posAntipodes[i];
		const orderAntipode = orderAntipodes[i];

		const cpAntipode: ContactPoint = {
			pointOnShape: posAntipode.pos, circle, order: orderAntipode, order2: 0
		};
		cpAntipodes.push(cpAntipode);
		const loopAntipode = posAntipode.pos.curve.loop;
		loopAntipodes.push(loopAntipode);
		const cpTreeAntipode = cpGraphs.get(loopAntipode)!;
		cpTreeAntipodes.push(cpTreeAntipode);
		const deltaAntipode = getNeighbouringPoints(
			cpTreeAntipode, posAntipode.pos, orderAntipode, 0
		);	
		deltaAntipodes.push(deltaAntipode);

		newCpAntipodes.push(insertCpNode(
			holeClosing,
			false,
			cpTreeAntipode,
			cpAntipode, 
			deltaAntipode[0]
		));
	}
	
	
	// Source
	const cpSource: ContactPoint = { pointOnShape: posSource, circle, order: orderSource, order2: 0 };
	const loopSource = posSource.curve.loop;
	const cpTreeSource = cpGraphs.get(loopSource)!;
	const deltaSource = getNeighbouringPoints(
		cpTreeSource, posSource, orderSource, 0
	);
	const newCpSource = insertCpNode(
		holeClosing,
		false,
		cpTreeSource,
		cpSource, 
		deltaSource[0]
	);


	// Connect graph
	if (newCpAntipodes.length === 1) {
		newCpSource.prevOnCircle = newCpAntipodes[0];
		newCpSource.nextOnCircle = newCpAntipodes[0];
	
		newCpAntipodes[0].prevOnCircle = newCpSource;
		newCpAntipodes[0].nextOnCircle = newCpSource;
	} else {
		const cpNodes = newCpAntipodes.slice();
		cpNodes.push(newCpSource);

		// Order points according to their angle with the x-axis
		cpNodes.sort(byAngle(circle));

		for (let i=0; i<cpNodes.length; i++) {
			const iNext = (i+1 === cpNodes.length) ? 0 : i+1;
			const iPrev = (i === 0) ? cpNodes.length-1 : i-1;

			const cpNodeCurr = cpNodes[i];
			const cpNodeNext = cpNodes[iNext];
			const cpNodePrev = cpNodes[iPrev];

			cpNodeCurr.nextOnCircle = cpNodeNext;
			cpNodeCurr.prevOnCircle = cpNodePrev;
		}
	}
	

	if (holeClosing) { 
		// TODO - important - take care of case where there are more than 1 antipode
		// Duplicate ContactPoints
		const cpB2: ContactPoint = { pointOnShape: posAntipodes[0].pos, circle, order: cpAntipodes[0].order, order2: +1 };
		const newCpB2Node = insertCpNode(true, false, cpTreeAntipodes[0], cpB2, newCpAntipodes[0]);
		
		const cpB1: ContactPoint = { pointOnShape: posSource, circle, order: cpSource.order, order2: -1 };
		const newCpB1Node = insertCpNode(true, false, cpTreeSource, cpB1, newCpSource.prev);
		
		// Connect graph
		newCpB1Node.prevOnCircle = newCpB2Node;
		newCpB1Node.nextOnCircle = newCpB2Node;
		newCpB2Node.prevOnCircle = newCpB1Node;
		newCpB2Node.nextOnCircle = newCpB1Node;
		
		newCpAntipodes[0].next = newCpSource;
		newCpSource.prev = newCpAntipodes[0];
		
		newCpB1Node.next = newCpB2Node;
		newCpB2Node.prev = newCpB1Node;
	}


	if (typeof _debug_ !== 'undefined') {
		let elems: TwoProngForDebugging[];
		if (holeClosing) {
			elems = _debug_.generated.elems['twoProng_holeClosing'];
		} else {
			elems = _debug_.generated.elems['twoProng_regular'];
		}

		const elem = elems[elems.length-1];

		if (!newCpSource) { console.log('asas')}
		elem.cpNode = newCpSource;
	}

	return newCpSource;
}


/** @internal */
function byAngle(circle: Circle) {
	const c = circle.center;

	return function(_a: CpNode, _b: CpNode) {
		let a = _a.cp.pointOnShape.p;
		let b = _b.cp.pointOnShape.p;

		// Move onto origin
		a = [a[0] - c[0], a[1] - c[1]];
		b = [b[0] - c[0], b[1] - c[1]];

		const a_ = Math.atan2(a[1], a[0]);
		const b_ = Math.atan2(b[1], b[0]);

		return b_ - a_;
	}
}


export { add2Prong }
