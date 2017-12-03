
import MAT_CONSTANTS from '../../mat-constants';

import Vector    from 'flo-vector2d';
import Memoize   from 'flo-memoize';
import Bezier3   from 'flo-bezier3';

import PathCurve from './path-curve';
import ListNode  from '../../linked-list/list-node'
import Circle    from './circle';
import Shape     from './shape';

import Corner    from '../../geometry/classes/corner';

let memoize = Memoize.m1;


/** 
 * @constructor 	
 * 	
 * @param bezierNode	
 * @param t - The bezier parameter value
 * @param type {MAT_CONSTANTS.pointType} 	
 *  'standard' : 0, // Not special,   	
 *  'sharp'    : 1, // Sharp corner, 	
 *  'dull'     : 2, // dull corner, 	
 * @param order - For dull corners only; equals the cross of
 * 		  the tangents at the corner interface to impose an order on
 * 		  points with the same point coordinates and t values.   
 * @param order2 - For points of hole closing 2-prongs only;
 *		  these points are duplicated to split the shape so they need
 *        to be ordered appropriately. 
 * @param circle - The osculating circle at this point pointing
 * towards the inside of the shape.
 */	
class PointOnShape {
    bezierNode: ListNode<PathCurve>; 	
	t         : number;	
	type      : number; // TODO - make enum
	order     : number;
    order2    : number;

    // Cache
    p : number[];
    0 : number;
    1 : number;

    constructor(
            bezierNode: ListNode<PathCurve>, 
            t: number, 
            type: number, 
            order: number, 
            order2: number) {

        this.bezierNode = bezierNode; 	
        this.t          = t;	
        this.type       = type;	
        this.order      = order; 
        this.order2     = order2;
        
        //---- Cache
        let p = Bezier3.evaluate(bezierNode.item.bezier3, t);
        this.p = p;
        // Removing this cache will help in that if {PointOnShape} is 
        // called as a parameter (where a point is required) it will more 
        // likely result in monomorphic behaviour as opposed to polymorphic 
        // or megamorphic.
        this[0] = p[0];
        this[1] = p[1];
    }	
	

    public static getOsculatingCircle = memoize(function(pos: PointOnShape) {

        if (pos.type === MAT_CONSTANTS.pointType.sharp) {
            return new Circle(pos.p, 0);
        } else if (pos.type === MAT_CONSTANTS.pointType.extreme) {
            let r = MAT_CONSTANTS.maxOsculatingCircleRadius;
            let p = [pos.p[0], pos.p[1] - r];
            return new Circle(p, r);
        }

        return PointOnShape.calcOsculatingCircle(
                pos.bezierNode.item, 
                pos.t
        ); 
    });


    /**
     * Calculates the osculating circle of the bezier at a 
     * specific t. If it is found to have negative or nearly zero radius
     * it is clipped to have positive radius so it can point into the shape.
     * @param pathCurve
     * @param t
     */
    public static calcOsculatingCircle(
            pathCurve: PathCurve, t: number): Circle {

        let ps = pathCurve.bezier3;
        let κ = -Bezier3.κ(ps, t); 

        // If (κ > 0) { Bending inwards. }
        
        let radius;
        if (κ <= 1/MAT_CONSTANTS.maxOsculatingCircleRadius) { 
            // Curving wrong way (or flat, or too big), but probably a 
            // significant point to put a 2-prong.
            radius = MAT_CONSTANTS.maxOsculatingCircleRadius;
        } else {
            radius = Math.min(
                    1/κ, 
                    MAT_CONSTANTS.maxOsculatingCircleRadius
            );
        }
        
        let normal = Bezier3.normal(ps,t);
        let p = Bezier3.evaluate(ps,t);
        let circleCenter = [
            p[0] + normal[0]*radius, 
            p[1] + normal[1]*radius
        ];

        return new Circle(circleCenter, radius);
    }


    /**
    * Compares two PointOnShapes according to their position on the bezier loop.
    */
    public static compare = function(
            a: PointOnShape, b: PointOnShape): number {

        if (a === undefined || b === undefined) {
            return undefined;
        }
        
        let res;
        
        res = a.bezierNode.item.indx - b.bezierNode.item.indx;
        if (res !== 0) { return res; }

        res = a.t - b.t;
        if (res !== 0) { return res; }

        res = a.order - b.order;
        if (res !== 0) { return res; }
        
        res = a.order2 - b.order2;
        
        return res;
    }


    /**
    * Returns true if its osculation circle is pointing straight upwards. 
    */
    public static isPointingStraightUp = function(pos: PointOnShape) {

        let circle = PointOnShape.getOsculatingCircle(pos); 
        if (!circle) { return false; }
        
        let circleDirection = Vector.toUnitVector(
                Vector.fromTo(pos.p, circle.center)
        );
        
        // If not almost pointing straight up
        if (Math.abs(circleDirection[0]) > 1e-6 || 
            circleDirection[1] > 0) {
            
            return false;
        }
        
        return true;
    }


    public static dullCornerAt(shape: Shape, p: number[]) {
        let dullCornerHash = shape.dullCornerHash;
        let key = PointOnShape.makeSimpleKey(p); 
        
        return dullCornerHash[key] || null;
    }


    /**
     * Sets the order (to distinguish between points lying on top of each 
     * other) of the contact point if it is a dull corner.
     * @param {PointOnShape} pos
     * @note Modifies pos
     */
    public static setPointOrder = function(
            shape: Shape, 
            circle: Circle, 
            pos: PointOnShape): number {
        
        let dullCorner = PointOnShape.dullCornerAt(shape, pos.p);
        
        if (!dullCorner) { return; }
        
        let ps = dullCorner.beziers[0];
        let tan1pre = Bezier3.tangent(ps,1);
        
        let tan1 = [tan1pre[1], -tan1pre[0]]; // rotate by -90 degrees
        let tan2 = Vector.toUnitVector(
                Vector.fromTo(pos.p, circle.center)
        );
        
        pos.order = -Vector.dot(tan1, tan2);
        
        return pos.order;
    }


    /**
     * Clones the PointOnShape.
     */
    // TODO - rename to clone
    // TODO - deep clone?
    public static copy(pos: PointOnShape) {
        return new PointOnShape(	
                pos.bezierNode, 
                pos.t, 
                pos.type, 
                pos.order, 
                pos.order2 
        );
    }


    /**
     * Creates a string key that only depends on the PointOnShape's coordinates.
     */
    public static makeSimpleKey = function(p: number[]) {	
        return '' + p[0] + ', ' + p[1]; 		
    }


    /**
     * Returns the PointOnShape type as a human-readable 
     * string.
     * @param {number} type
     * @returns {string}
     */
    // TODO - remove - use enum
    public static typeToStr(type: number) {
        for (let key in MAT_CONSTANTS.pointType) {
            if ((MAT_CONSTANTS.pointType as any)[key] === type) {
                return key;
            }
        }
    }


    /**
     * @description Returns a human-readable string of the PointOnShape.
     * @note For debugging only.
     */
    public static toHumanString = function(pos: PointOnShape) {
        return '' + pos[0] + ', ' + pos[1] + 
            ' | bz: '   + pos.bezierNode.item.indx + 
            ' | t: '    + pos.t + 
            ' | ord: '  + pos.order + 
            ' | ord2: ' + pos.order2 + ' | ' +
            PointOnShape.typeToStr(pos.type); // TODO - use enum
    }

}


export default PointOnShape;
