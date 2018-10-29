
import { dot, fromTo, toUnitVector, rotateNeg90Degrees } from 'flo-vector2d';
import { memoize } from 'flo-memoize';
import { normal, evaluate, κ as curvature }   from 'flo-bezier3';

import { Corner } from './corner'
import { Curve  } from './curve'
import { Circle } from './circle';

/**
 * Represents a point on the shape boundary for which MAT vertex information 
 * has not *necessarily* been calculated.
 */
class PointOnShape {

    /** 
     * @param curve	The [[Curve]] on the shape boundary this points belong to.
     * @param t The bezier parameter value on the curve to identify the point
     * coordinates.
     */	
    constructor(
            public curve: Curve, 
            public t: number) {
    }	


    // Cache
    private p_ : number[] = undefined;
    /**
     * The planar point coordinates of this [[PointOnShape]].
     */
    get p() {
        return this.p_ === undefined
            ? this.p_ = evaluate(this.curve.ps, this.t)
            : this.p_;
    }
    
    
    /**
     * Returns the osculating circle at this point of the curve.
     * @param maxOsculatingCircleRadius If not Number.POSITIVE_INFINITY then the
     * circle radius will be limited to this value.
     * @param pos The [[PointOnShape]] identifying the point.
     */
    public static getOsculatingCircle(
            maxOsculatingCircleRadius: number, 
            pos: PointOnShape) {

        if (PointOnShape.isSharpCorner(pos)) {
            return new Circle(pos.p, 0);
        }

        let radius = PointOnShape.calcOsculatingCircleRadius(pos); 

        if (radius < 0) { radius = Number.POSITIVE_INFINITY; }
        radius = Math.min(
            radius, 
            maxOsculatingCircleRadius
        );

        let ps = pos.curve.ps;
        let t  = pos.t;
        
        let normal_ = normal(ps,t);
        let p = evaluate(ps,t);
        let circleCenter = [
            p[0] + normal_[0]*radius, 
            p[1] + normal_[1]*radius
        ];

        return new Circle(circleCenter, radius);
    }


    /**
     * Calculates and returns the osculating circle radius of the bezier at a 
     * specific t. If it is found to have negative or nearly zero radius
     * it is clipped to have positive radius so it can point into the shape.
     * @param ps
     * @param t
     * @private
     */
    public static calcOsculatingCircleRadius = memoize(function(pos: PointOnShape) {

        let ps = pos.curve.ps;
        let t  = pos.t;

        let κ = -curvature(ps, t); 

        // κ > 0 => bending inwards

        return 1/κ;
    });


    /**
     * Compares two [[PointOnShape]]s according to their cyclic ordering imposed
     * by their relative positions on the shape boundary. 
     * @param a The first [[PointOnShape]].
     * @param b The second [[PointOnShape]].
     * @private
     */
    public static compare = function(a: PointOnShape, b: PointOnShape) {
        if (a === undefined || b === undefined) {
            return undefined;
        }
        
        let res;
        
        res = a.curve.idx - b.curve.idx;
        if (res !== 0) { return res; }

        res = a.t - b.t;

        return res;
    }


    /**
     * Ignores order2 (used in hole-closing two-prongs only)
     * @private
     */
    public static compareInclOrder = function(
            a: PointOnShape, 
            b: PointOnShape,
            aOrder: number,
            bOrder: number) {

        let res = PointOnShape.compare(a, b);

		if (res === undefined) { return undefined; }
		
		if (res !== 0) { return res; }

		res = aOrder - bOrder;
        
        return res;
    }


    /**
     * @private
     */
    public static getCorner = memoize(function(pos: PointOnShape) {
        if (pos.t !== 0 && pos.t !== 1) { return undefined; }

        return Curve.getCornerAtEnd(
            pos.t === 1 ? pos.curve : pos.curve.prev
        );
    });


    /**
     * @private
     */
    public static isSharpCorner = memoize(function(pos: PointOnShape) {
        let corner = PointOnShape.getCorner(pos);
        return corner && corner.isSharp;
    });


    /**
     * @private
     */
    public static isDullCorner = memoize(function(pos: PointOnShape) {
        let corner = PointOnShape.getCorner(pos);
        return corner && corner.isDull;
    });


    /**
     * @private
     */
    public static isQuiteSharpCorner = memoize(function(pos: PointOnShape) {
        let corner = PointOnShape.getCorner(pos);
        return corner && corner.isQuiteSharp;
    });


    /**
     * @private
     */
    public static isQuiteDullCorner = memoize(function(pos: PointOnShape) {
        let corner = PointOnShape.getCorner(pos);
        return corner && corner.isQuiteDull;
    });


    /**
     * Calculates the order (to distinguish between points lying on top of each 
     * other) of the contact point if it is a dull corner.
     * @param pos
     * @private
     */
    public static calcOrder(
            circle : Circle, 
            pos    : PointOnShape): number {
        
        if (!PointOnShape.isDullCorner(pos)) { return 0; }

        let corner = PointOnShape.getCorner(pos);

        let n = rotateNeg90Degrees(corner.tangents[0]);
        let v = toUnitVector( fromTo(pos.p, circle.center) );

        return -dot(n, v);
    }


    /**
     * Returns a human-readable string of the given [[PointOnShape]]. 
     * For debugging only.
     * @private
     */
    public static toHumanString = function(pos: PointOnShape) {
        return '' + pos.p[0] + ', ' + pos.p[1] + 
            ' | bz: '   + pos.curve.idx + 
            ' | t: '    + pos.t 
    }
}


export { PointOnShape };
