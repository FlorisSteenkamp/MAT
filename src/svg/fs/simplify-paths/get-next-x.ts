
import { X } from '../../../x/x';


/**
 * 
 * @param xs An array of intersections on the curve
 * @param curT The current t value
 * @param forwards If true go forwards else go backwards
 */
function getNextX(
        xs: X[], 
        curT: number,
        forwards: boolean,
        wasOnX: boolean) {

    let bestX = undefined;
    let bestT = Number.POSITIVE_INFINITY;
    for (let i=0; i<xs.length; i++) {
        let x = xs[i];
        let t = x.pos.t;

        let deltaT = forwards 
            ? t - curT
            : curT - t;

        if ((deltaT > 0 || (deltaT === 0 && !wasOnX)) && deltaT < bestT) {
            bestX = x;
            bestT = deltaT;
        }
    }

    return bestX;
}


/**
 * 
 * @param xs An array of intersections on the curve
 * @param t The current t value
 */
function getThisX(xs: X[], t: number) {
    for (let i=0; i<xs.length; i++) {
        let x = xs[i];

        if (x.pos.t - t === 0) {
            return x;
        }
    }
}


export { getNextX, getThisX }
