
import { flatCoefficients } from 'flo-poly';

import { Curve } from '../curve';
import { quadraticToCubic } from '../svg/fs/quadratic-to-cubic';
import { linearToCubic } from '../svg/fs/linear-to-cubic';
import { toGrid } from '../numerical/to-grid';
	

/**
 * Represents a two-way linked loop of [[Curve]]s - mostly used internally to 
 * conveniently represent shape boundaries.
 */
class Loop {
    /**
     * The curves that represent the shape boundary as an array.
     */
    readonly curves: Curve[];
    /**
     * A handle on the linked loop.
     */
    readonly head: Curve;

    //parent: Loop = undefined;
    //children: Loop[] = [];


    /**
     * @param beziers - A pre-ordered array of bezier curves to add initially.
     * @param children - Child loops connected via hole closers
     */
    constructor(
            public beziers: number[][][] = []) {

        this.curves = [];

        let loop = this;

        if (beziers.length === 0) { return undefined; }
        
        let head: Curve;
        let prev: Curve = null;
        let node: Curve;
        
        for (let i=0; i<beziers.length; i++) {

            node = new Curve(
                loop,
                beziers[i],
                prev,
				null,
				i
            );

            loop.curves.push(node);
            
            if (prev) { prev.next = node; }
            prev = node; 
            
            if (i === 0) { head = node; }
        }
        
        // Close loop
        head.prev = node;
        node.next = head;
            
        this.head = head;
    }


    /**
     * Returns the loop as an array of beziers.
     */
    public toBeziers() {
        let beziers: number[][][] = [];
        for (let curve of this.curves) {
            beziers.push(curve.ps);
        }

        return beziers;
    }

    
    /**
     * Creates and returns a [[Loop]] from the given array of cubic beziers.
     * @param beziers An array of cubic beziers.
     */
    static fromCubicBeziers(beziers: number[][][] = []) {
        return new Loop(beziers);
    }


    /**
     * Perturbs the loop. Not used.
     * @param loop 
     * @param x 
     * @hidden
     */
    static perturb(loop: Loop, x: number) {
        if (!x) { return loop; }

        let seed = 2311; // Just some value

        let newItems: number[][][] = [];

        for (let i=0; i<loop.beziers.length; i++) {

            // This gets us a predictable random number between 0 and 1;
            let rand1 = flatCoefficients(6, -1, 1, seed);
            let rs = rand1.p;
            seed = rand1.seed; // Get next seed.

            let vs = rs.map(r => r*x);
            console.log(vs)

            let ps = loop.beziers[i];

            let [[x0,y0], [x1,y1], [x2,y2]] = ps;

            let newPs = [
                [x0+vs[0], y0+vs[1]], 
                [x1+vs[2], y1+vs[3]], 
                [x2+vs[4], y2+vs[5]], 
                [0, 0]
            ];

            if (i !== 0) {
                let prev = newItems[newItems.length-1];
                prev[3][0] = newPs[0][0];
                prev[3][1] = newPs[0][1];
            }

            newItems.push(newPs);
        }

        let last = newItems[newItems.length-1];
        last[3][0] = newItems[0][0][0];
        last[3][1] = newItems[0][0][1];

        return new Loop(newItems);
    }


    /**
     * reduceSignificands of the loop. Not used.
     * @param loop 
     * @param x 
     * @hidden
     */
    static toGrid(
            loop: Loop, 
            max: number,
            significantFigures: number) {

        let newPss: number[][][] = [];

        function f(a: number) {
            let res = toGrid(a, max, significantFigures);
            return res;
        }

        for (let i=0; i<loop.beziers.length; i++) {

            let ps = loop.beziers[i];

            let [[x0,y0], [x1,y1], [x2,y2], [x3, y3]] = ps;

            let newPs = [
                [f(x0), f(y0)],
                [f(x1), f(y1)], 
                [f(x2), f(y2)],
                [f(x3), f(y3)],
            ];

            newPss.push(newPs);
        }

        return new Loop(newPss);
    }
}


export { Loop }
