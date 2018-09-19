
import { PathState  } from '../path-state';
import { dePathologify } from './de-pathologify';
import { isAlmostZeroLength } from './is-almost-zero-length';

// TODO - 1e4 is arbitrary
const RESOLUTION = 1e4;

/**
 * 
 * @param beziers The array of path curves
 * @param ps_ The bezier
 * @param state The current path state
 */
function pushBezier(
        beziers: number[][][], 
        ps_: number[][], 
        s: PathState, 
        max: number) {    
    
            /*
    if ( isAlmostZeroLength(ps_, max/RESOLUTION) ) {
        if ( isAlmostZeroLength(ps_, 0) ) {
            return;
        }
        //console.log(ps_);
    }

    beziers.push(ps_);
    */

    if ( isAlmostZeroLength(ps_, max/RESOLUTION) ) {
        let len = beziers.length;
        if (len === 0) {
            s.initialPoint = ps_[3];
        } else {
            let prevPs = beziers[len-1];
            prevPs[3] = ps_[3];
        }
        return;
    }

    let ps = dePathologify(ps_, max);

    beziers.push(ps);
}


export { pushBezier }
