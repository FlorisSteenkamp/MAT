
import { PathState } from '../path-state';


/** 
 * Z and z: (from www.w3.org) 
 * 
 * params: (none)
 * 
 * Close the current subpath by drawing a straight line from the current point 
 * to current subpath's initial point. Since the Z and z commands take no 
 * parameters, they have an identical effect.
 */
function z(s: PathState) {
    let xInterval = (s.initialPoint[0] - s.p[0]) / 3;
    let yInterval = (s.initialPoint[1] - s.p[1]) / 3;
    
    let ps = [
        s.p,
        [s.p[0] + xInterval  , s.p[1] + yInterval  ],
        [s.p[0] + xInterval*2, s.p[1] + yInterval*2],
        [s.p[0] + xInterval*3, s.p[1] + yInterval*3]
    ];

    s.prev2ndCubicControlPoint = undefined;
    s.prev2ndQuadraticControlPoint = undefined;

    return ps;
}


export { z }
