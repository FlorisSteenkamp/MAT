
import { allRoots } from 'flo-poly';

import { len, translateThenRotatePs } from 'flo-vector2d';
import { getY, evaluate } from 'flo-bezier3';


/**
 * Get all intersection points between a line and a bezier within a certain t 
 * range.
 */
function getLineBezierIntersection(
        line: number[][], ps: number[][], tRange: number[]) {

    let t = [-line[0][0], -line[0][1]];
    let p = [
        line[1][0] + t[0],
        line[1][1] + t[1],
    ];


    // Cache
    let lineLength = len(p); 
    let sinθ = -p[1] / lineLength;
    let cosθ = p[0] / lineLength;

    let newPs = translateThenRotatePs(t, sinθ, cosθ, ps);

    let roots = allRoots(getY(newPs), 0, 1);

    let ev = evaluate(ps);
    return roots.map( t => ({ p: ev(t), t }) );
}


export { getLineBezierIntersection }
