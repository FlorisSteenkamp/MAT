
import Circle       from '../../geometry/classes/circle';
import ContactPoint from '../../mat/classes/contact-point';
import LinkedLoop   from '../../linked-list/linked-loop';
import ListNode     from '../../linked-list/list-node';
import MatCircle    from '../../mat/classes/mat-circle';
import Shape        from '../../geometry/classes/shape';
import PointOnShape from '../../geometry/classes/point-on-shape';
import HoleClosing2Prong from '../classes/hole-closing-2-prong';

/**
 * Adds a 2-prong contact circle to the shape.
 * 
 * @param shape Shape to add the 2-prong to
 * @param circle Circle containing the 2 contact points
 * @param pos1 - First point on shape
 * @param pos2 - Second point on shape
 * @param delta The boundary piece within which the new contact point should be 
 * placed
 */
function add2Prong(
        shape: Shape, 
        circle: Circle, 
        pos1: PointOnShape, 
        pos2: PointOnShape, 
        holeClosing: boolean): void {

	if (holeClosing) {
		pos1.order2 = 1;
		pos2.order2 = -1;
	}
	
	let cp2 = new ContactPoint(pos2, undefined);
	let delta2 = Shape.getNeighbouringPoints(shape, pos2); 
	let cmp3 = delta2[0] === undefined ? undefined : ContactPoint.compare(delta2[0].item, cp2); 
	let cmp4 = delta2[1] === undefined ? undefined : ContactPoint.compare(cp2, delta2[1].item);
	if (typeof window !== 'undefined' && (<any>window)._debug_) {
		if (cmp3 > 0 || cmp4 > 0) {
			//console.log(`2-PRONG 2 Order is wrong 2: ${cmp3}, ${cmp4}`);
		}
	}
	if (cmp3 === 0 || cmp4 === 0) {
		// Should not really be possible with hole-closing 2-prongs.
		return undefined;
	}
	let k2 = pos2.bezierNode.loop.indx;
	let newCp2Node = shape.contactPointsPerLoop[k2].insert(
        cp2, delta2[0]
    );
	
	
	let cp1 = new ContactPoint(pos1, undefined);
	let delta1 = Shape.getNeighbouringPoints(shape, pos1);
	let cmp1 = delta1[0] === undefined ? undefined : ContactPoint.compare(delta1[0].item, cp1);
	let cmp2 = delta1[1] === undefined ? undefined : ContactPoint.compare(cp1, delta1[1].item);
	if (typeof window !== 'undefined' && (<any>window)._debug_) {
		if (cmp1 > 0 || cmp2 > 0) {
			//console.log(`2-PRONG 1 Order is wrong 2: ${cmp1}, ${cmp2}`);
		}
	}
	// If they are so close together, don't add it - there's already 1
	if (cmp1 === 0 || cmp2 === 0) {
		// Should not be possible with hole-closing 2-prongs.
		shape.contactPointsPerLoop[k2].remove(newCp2Node);
		return undefined;
	}
	let k1 = pos1.bezierNode.loop.indx;
	let newCp1Node = shape.contactPointsPerLoop[k1].insert(
			cp1, 
			delta1[0]
	);
	
	let matCircle = MatCircle.create(circle, [newCp1Node, newCp2Node]);
	
	newCp1Node.prevOnCircle = newCp2Node;
	newCp1Node.nextOnCircle = newCp2Node;

	newCp2Node.prevOnCircle = newCp1Node;
	newCp2Node.nextOnCircle = newCp1Node;
	
	
	if (holeClosing) {
		// If hole-closing then we duplicate the 2 contact points
		// so that we can 'split the loop'.
		
		let posA1 = pos2;
		let posB2 = PointOnShape.copy(posA1);
		posB2.order2 = 1;
		let cpB2 = new ContactPoint(posB2, undefined);
		
		let newCpB2Node = shape.contactPointsPerLoop[k2].insert(
				cpB2, 
				newCp2Node
		);
		
		
		let posA2 = pos1;
		let posB1 = PointOnShape.copy(posA2);
		posB1.order2 = -1;
		let cpB1 = new ContactPoint(posB1, undefined);
		
		let newCpB1Node = shape.contactPointsPerLoop[k1].insert(
				cpB1, 
				newCp1Node.prev
		);
		
		
		MatCircle.create(circle, [newCpB1Node, newCpB2Node]);
		
		newCpB1Node.prevOnCircle = newCpB2Node;
		newCpB1Node.nextOnCircle = newCpB2Node;
		newCpB2Node.prevOnCircle = newCpB1Node;
		newCpB2Node.nextOnCircle = newCpB1Node;
		
		newCp2Node.next = newCp1Node;
		newCp1Node.prev = newCp2Node;
		
		newCpB1Node.next = newCpB2Node;
		newCpB2Node.prev = newCpB1Node;
		
        
        shape.holeClosers.push(new HoleClosing2Prong(
			k1, k2,
			newCp1Node,
			newCp2Node,
			newCpB1Node,
			newCpB2Node	
        ));
        
	}
	
	
	if (typeof window !== 'undefined' && (<any>window)._debug_) {
        // Add points so when we alt-click shape point is logged.
        const _debug_ = (<any>window)._debug_;
		prepForDebug(newCp1Node, _debug_);
		prepForDebug(newCp2Node, _debug_);
	}
	
	return;
}


function prepForDebug(contactPoint: ListNode<ContactPoint>, _debug_: any) {
	//---- Prepare debug info for the ContactPoint
	let cpKey = PointOnShape.makeSimpleKey(
			contactPoint.item.pointOnShape.p
	);
	let cpHash = _debug_.generated.cpHash;
	let cpArr = _debug_.generated.cpArr;
	if (!cpHash[cpKey]) {
		cpHash[cpKey] = {
			cp: contactPoint,
			arrIndx: cpArr.length	
		};
		cpArr.push(contactPoint);
	}	
	
	let cpHashDebugObj = cpHash[cpKey];
	
	cpHashDebugObj.visitedPointsArr = 
		cpHashDebugObj.visitedPointsArr || [];
}


export default add2Prong;
