
import PointOnShape from '../../../geometry/classes/point-on-shape';
import ListNode     from '../../../linked-list/list-node';
import ContactPoint from '../../classes/contact-point';
import Circle       from '../../../geometry/classes/circle';

class TwoProngForDebugging {

    pos: PointOnShape;
	δ: ListNode<ContactPoint>[];
	y: number[];
	z: number[];
	x: number[];
	circle: Circle;
	xs: { 
        x: number[]; 
        y: PointOnShape; 
        z: PointOnShape; 
        t: number; 
    }[];
	failed: boolean;
    holeClosing: boolean;
    
    constructor(
            pos: PointOnShape, 
            δ: ListNode<ContactPoint>[], 
            y: number[], 
            z: number[], 
            x: number[], 
            circle: Circle, 
            xs: { 
                x: number[]; 
                y: PointOnShape; 
                z: PointOnShape; 
                t: number; 
            }[], 
            failed: boolean, 
            holeClosing: boolean) {

	    this.pos    = pos;
    	this.δ      = δ;
	    this.y      = y;
	    this.z      = z;
	    this.x      = x;
	    this.circle = circle;
	    this.xs     = xs;
	    this.failed = failed;
        this.holeClosing = holeClosing;
    }
}


export default TwoProngForDebugging;
