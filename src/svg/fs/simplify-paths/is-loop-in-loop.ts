
import { flatCoefficients, allRoots } from 'flo-poly';
import { 
    getBoundingBox, getX, getY, tangent, evaluate, translate
} from 'flo-bezier3';
import { Loop         } from "../../../loop/loop";
import { PointOnShape } from '../../../point-on-shape';
import { getLoopBounds } from "../get-loop-bounds";


/** @hidden */
// TODO - remove delta
const DELTA = 1e-6;


type Dir =
    | 'left'
    | 'right'
    | 'down'
    | 'up';


/**
 * @hidden
 * Returns true if the first loop is contained wholly within the second. At this
 * stage we already know the loop is either wholly contained inside the loop
 * or is wholly outside.
 * @param loops 
 */
function isLoopInLoop(loops: Loop[]) {

    let i = 0;
    let seed = 1231; // Just some value
    do {
        i++;

        // This gets us a predictable random number between 0 and 1;
        let rand1 = flatCoefficients(1, 0, 1, seed);
        let t = rand1.p[0];
        seed = rand1.seed; // Get next seed.
        
        // This gets us a predictable random number roughly between 0 and the 
        // number of curves in the loop.
        let curveCount = loops[0].curves.length;
        let rand2 = flatCoefficients(1, 0, curveCount, seed);
        
        let idx = Math.floor(rand2.p[0]);
        seed = rand2.seed; // Get next seed.

        let ps = loops[0].curves[idx].ps;
        let p = evaluate(ps, t);

        let res = f(loops, p);
        
        if (res !== undefined) {
            return res;
        }        
    } while (i < 10);

    return undefined; // There's no chance we'll get up to this point.


    function f(loops: Loop[], p: number[]) {
        if (isLoopNotInLoop(loops)) {
            return false;
        }

        //let g = _debug_.generated.g;
        //let bounds = getShapeBounds(loops);
        //_debug_.fs.draw.dot(g, p, (bounds.maxX.p[0] - bounds.minX.p[0]) * 0.002, 'blue');
    
        let intersections = getAxisAlignedRayLoopIntersections(loops[1], p, 'left');
        //console.log(intersections, intersections.length % 2 !== 0);
        if (intersections) { return intersections.length % 2 !== 0; }
    }
}


/**
 * @hidden
 * Returns true if the first loop is not wholly within the second. The converse
 * is not necessarily true. It is assumed the loops don't intersect.
 * @param loops
 */
function isLoopNotInLoop(loops: Loop[]) {
    let loopBoundss = loops.map(getLoopBounds);
    
    let boundss = loopBoundss.map(loopBound => {
        return {
            minX: loopBound.minX.p[0],
            maxX: loopBound.maxX.p[0],
            minY: loopBound.minY.p[1],
            maxY: loopBound.maxY.p[1]
        };
    });

    return (
        boundss[0].minX < boundss[1].minX || 
        boundss[0].maxX > boundss[1].maxX ||
        boundss[0].minY < boundss[1].minY || 
        boundss[0].maxY > boundss[1].maxY
    );
}


/**
 * @hidden
 * @param p The point where the horizontal ray starts
 * @param toLeft The ray to the left of this point (else right)
 * @param loop A loop of curves
 */
function getAxisAlignedRayLoopIntersections(
        loop: Loop, p: number[], dir: Dir) {

    let [x,y] = p;
    let curves = loop.curves;
    let possAll: PointOnShape[] = [];

    for (let i=0; i<curves.length; i++) {
        let curve = curves[i];
        let ps = curve.ps;

        //------------------------------------------------------/
        //---- Check if ray intersects bezier bounding box -----/
        //------------------------------------------------------/
        let [[minX,minY],[maxX,maxY]] = getBoundingBox(ps);
        let notIntersecting = 
            ((dir === 'left' || dir === 'right') && (minY > y || maxY < y)) ||
            ((dir === 'up'   || dir === 'down' ) && (minX > x || maxX < x));
        notIntersecting = notIntersecting ||
            (dir === 'left' && minX > x) || (dir === 'right' && maxX < x) ||
            (dir === 'down' && minY > y) || (dir === 'up'    && maxY < y);

        if (notIntersecting) { continue; } // No intersection with bezier


        //------------------------------------------------------/
        //----------- Get intersection ts on bezier ------------/
        //------------------------------------------------------/
        // Get the bezier's x-coordinate power representation.
        let ts: number[] = [];
        
        let f;
        let offset;
        let axis;
        let dirIsDecreasing = (dir === 'left' || dir === 'up');
        if (dir === 'left' || dir === 'right') {
            f = getY;
            offset = [0,-y];
            axis = 0;
        } else {
            f = getX;
            offset = [-x,0];
            axis = 1;
        }

        let translatedPs = translate(offset, ps);
        let poly = f(translatedPs); 
        let ev = evaluate(translatedPs);
        let ts_ = allRoots(poly,0-DELTA,1+DELTA);
        
        for (let i=0; i<ts_.length; i++) {
            let t = ts_[i];

            if (Math.abs(t) < DELTA || Math.abs(t-1) < DELTA) {
                // We don't know the exact number of intersections due to
                // floating point arithmetic. 
                return undefined;
            }
            
            let p_ = ev(t);
            if (( dirIsDecreasing && p[axis] >= p_[axis]) || 
                (!dirIsDecreasing && p[axis] <= p_[axis])) {

                ts.push(t);
            }
        }


        //------------------------------------------------------/
        //----- Check if line is tangent to intersections ------/
        //------------------------------------------------------/
        // We only care if there were 1 or 3 intersections.
        if (ts.length === 1 || ts.length === 3) {
            for (let t of ts) {
                let tan = tangent(ps, t);
                if (((dir === 'left' || dir === 'right') && Math.abs(tan[1]) < DELTA) ||
                    ((dir === 'down' || dir === 'up'   ) && Math.abs(tan[0]) < DELTA)) {
                    
                    // We don't know the exact number of intersections due to
                    // floating point arithmetic
                    return undefined; 
                }
            }
        }

        possAll.push(...ts.map(t => new PointOnShape(curve, t)));
    }

    return possAll;
}


export { isLoopInLoop }
