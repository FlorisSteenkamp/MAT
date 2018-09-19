
import { dot, fromTo, toUnitVector, rotateNeg90Degrees } from 'flo-vector2d';
import Memoize from 'flo-memoize';
import { normal, evaluate, κ as curvature }   from 'flo-bezier3';

import { getLoopBounds } from './svg/svg';

import { Curve  } from './curve'
import { Circle } from './circle';

let memoize = Memoize.m1;


class PointOnShape {
    /*readonly*/ curve : Curve; 	
	/*readonly*/ t     : number;	

    // Cache
    private p_ : number[] = undefined;
    get p() {
        return this.p_ === undefined
            ? this.p_ = evaluate(this.curve.ps, this.t)
            : this.p_;
    }


    /** 
     * @param curve	
     * @param t - The bezier parameter value
     */	
    constructor(curve: Curve, t: number) {
        this.curve = curve;
        this.t = t;
    }	
    
    
    public static getOsculatingCircle(
            maxOsculatingCircleRadius: number, pos: PointOnShape) {

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
     * Calculates the osculating circle of the bezier at a 
     * specific t. If it is found to have negative or nearly zero radius
     * it is clipped to have positive radius so it can point into the shape.
     * @param ps
     * @param t
     */
    public static calcOsculatingCircleRadius = memoize(function(pos: PointOnShape) {

        let ps = pos.curve.ps;
        let t  = pos.t;

        let κ = -curvature(ps, t); 

        // κ > 0 => bending inwards

        return 1/κ;
    });


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
		//if (res !== 0) { return res; }

        //return a.order2 - b.order2;
        
        return res;
    }


    public static getCorner = memoize(function(pos: PointOnShape) {
        if (pos.t !== 0 && pos.t !== 1) { return undefined; }

        return Curve.getCornerAtEnd(
            pos.t === 1 ? pos.curve : pos.curve.prev
        );
    });


    public static isSharpCorner = memoize(function(pos: PointOnShape) {
        let corner = PointOnShape.getCorner(pos);
        return corner && corner.isSharp;
    });


    public static isDullCorner = memoize(function(pos: PointOnShape) {
        let corner = PointOnShape.getCorner(pos);
        return corner && corner.isDull;
    });


    public static isQuiteSharpCorner = memoize(function(pos: PointOnShape) {
        let corner = PointOnShape.getCorner(pos);
        return corner && corner.isQuiteSharp;
    });


    public static isQuiteDullCorner = memoize(function(pos: PointOnShape) {
        let corner = PointOnShape.getCorner(pos);
        return corner && corner.isQuiteDull;
    });


    /**
     * Calculates the order (to distinguish between points lying on top of each 
     * other) of the contact point if it is a dull corner.
     * @param pos
     */
    public static calcOrder(
            circle : Circle, 
            pos    : PointOnShape): number {
        
        if (!PointOnShape.isDullCorner(pos)) { return 0; }

        //let corner = Curve.getCornerAtEnd(pos.curve);
        let corner = PointOnShape.getCorner(pos);

        let n = rotateNeg90Degrees(corner.tans[0]);
        let v = toUnitVector( fromTo(pos.p, circle.center) );
        /*
        console.log('------------------------------');
        console.log('circle.center: ', circle.center);
        console.log('pos.p: ', pos.p);
        console.log('corner: ', corner);
        console.log('tans[0]: ', corner.tans[0]);
        console.log('n: ', n);
        console.log('v: ', v);
        console.log('-dot(n, v): ', -dot(n, v));
        */

        return -dot(n, v);
    }


    /**
     * Returns a human-readable string of the given PointOnShape. 
     * For debugging only.
     */
    public static toHumanString = function(pos: PointOnShape) {
        return '' + pos.p[0] + ', ' + pos.p[1] + 
            ' | bz: '   + pos.curve.idx + 
            ' | t: '    + pos.t 
    }
}


export { PointOnShape };
