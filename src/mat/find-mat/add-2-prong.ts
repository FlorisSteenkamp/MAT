
declare var _debug_: MatDebug;

import { MatDebug } from '../../debug/debug';

import LlRbTree from 'flo-ll-rb-tree';

import { Loop         } from '../../loop';
import { CpNode       } from '../../cp-node';
import { Circle       } from '../../circle';
import { ContactPoint } from '../../contact-point';
import { PointOnShape } from '../../point-on-shape';

import { isAnotherCpCloseby } from '../is-another-cp-closeby';
import { getNeighbouringPoints } from '../get-neighboring-cps';


/**
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
        posAntipode   : PointOnShape, 
		holeClosing   : boolean,
		extreme       : number) {

	let orderSource   = PointOnShape.calcOrder(circle, posSource);
	let orderAntipode = PointOnShape.calcOrder(circle, posAntipode);

	let t_s = posSource.t;
	let curve;
	if (t_s === 0) {
		t_s = 1;
		curve = posSource.curve.prev;
		posSource = new PointOnShape(curve, t_s);
	}


	// Make sure there isn't already a ContactPoint close by - it can cause
	// floating point stability issues.
	if (isAnotherCpCloseby(cpGraphs, posSource,   circle, orderSource,   0, extreme, 'red') ||
		isAnotherCpCloseby(cpGraphs, posAntipode, circle, orderAntipode, 0, extreme, 'red')) {

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
	let cpAntipode = new ContactPoint(posAntipode, circle, orderAntipode, 0);
	let loopAntipode = posAntipode.curve.loop;
	let cpTreeAntipode = cpGraphs.get(loopAntipode);
	let deltaAntipode = getNeighbouringPoints(
		cpTreeAntipode, posAntipode, orderAntipode, 0
	);
	let newCpAntipode = CpNode.insert(
		holeClosing,
		false,
		cpTreeAntipode,
		cpAntipode, 
		deltaAntipode[0]
	);
	//console.log(cpAntipode.pointOnShape.t);

	// Source
	let cpSource = new ContactPoint(posSource, circle, orderSource, 0);
	let loopSource = posSource.curve.loop;
	let cpTreeSource = cpGraphs.get(loopSource);
	let deltaSource = getNeighbouringPoints(
		cpTreeSource, posSource, orderSource, 0
	);
	let newCpSource = CpNode.insert(
		holeClosing,
		false,
		cpTreeSource,
		cpSource, 
		deltaSource[0]
	);
	//console.log(cpSource.pointOnShape.t);


	// Connect graph
	newCpSource.prevOnCircle = newCpAntipode;
	newCpSource.nextOnCircle = newCpAntipode;

	newCpAntipode.prevOnCircle = newCpSource;
	newCpAntipode.nextOnCircle = newCpSource;

	

	if (holeClosing) { 
		// Duplicate ContactPoints
		let cpB2 = new ContactPoint(posAntipode, circle, cpAntipode.order, +1);
		let newCpB2Node = CpNode.insert(true, false, cpTreeAntipode, cpB2, newCpAntipode);
		
		let cpB1 = new ContactPoint(posSource, circle, cpSource.order, -1);
		let newCpB1Node = CpNode.insert(true, false, cpTreeSource, cpB1, newCpSource.prev);
		
		// Connect graph
		newCpB1Node.prevOnCircle = newCpB2Node;
		newCpB1Node.nextOnCircle = newCpB2Node;
		newCpB2Node.prevOnCircle = newCpB1Node;
		newCpB2Node.nextOnCircle = newCpB1Node;
		
		newCpAntipode.next = newCpSource;
		newCpSource  .prev = newCpAntipode;
		
		newCpB1Node.next = newCpB2Node;
		newCpB2Node.prev = newCpB1Node;
	}

	return newCpSource;
}


export { add2Prong };
