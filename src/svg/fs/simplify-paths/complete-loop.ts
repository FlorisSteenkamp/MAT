
import { fromTo, reverse } from 'flo-bezier3';
import { Curve } from '../../../curve';
import { X } from '../../../x/x';
import { ILoopTree  } from './i-loop-tree';
import { getNextX } from './get-next-x';


/** @hidden */
function completeLoop(
        intersections : Map<Curve, X[]>,
        takenXs       : Set<X>,
        xStack        : X[],
        loopTree      : ILoopTree,
        x             : X) {

    let beziers: number[][][] = [];

    let reversed = 
        (loopTree.windingNum === 0 && loopTree.orientation === -1) ||
        (loopTree.windingNum !== 0 && loopTree.orientation === +1);

    let pos = reversed ? x.pos : x.opposite.pos;

    let startBez = pos.curve;
    let startT   = pos.t;

    let curBez = startBez;
    let curT   = startT;

    let fromX = x.isDummy 
        ? undefined 
        : reversed ? x.opposite : x;
    let wasOnX = true;

    while (true) {
        let xs = intersections.get(curBez);

        let x_ = xs ? getNextX(xs, curT, !reversed, wasOnX) : undefined;

        // Add a bezier to the component loop.
        if (x_) {
            // We are at an intersection
            wasOnX = true;

            if (curT !== x_.pos.t) { 
                let ps = reversed
                    ? reverse( fromTo(curBez.ps)(x_.pos.t, curT) )
                    : fromTo(curBez.ps)(curT, x_.pos.t);

                beziers.push(ps); 

                addXOutPs(reversed, fromX, ps);
                fromX = x_;
            }

            // Move onto next bezier
            curBez = x_.opposite.pos.curve; // Switch to other path's bezier
            curT   = x_.opposite.pos.t; // ...

            let _x_ = reversed ? x_.opposite : x_;

            _x_.loopTree = loopTree;
            if (!takenXs.has(_x_.opposite)) {
                xStack.push(_x_.opposite);
            }

            takenXs.add(_x_); // Mark this intersection as taken
        } else {
            wasOnX = false;

            let t = reversed ? 0 : 1;
            if (curT !== t) { 
                let ps = reversed
                    ? reverse( fromTo(curBez.ps)(0, curT) ) 
                    : fromTo(curBez.ps)(curT, 1);
                
                beziers.push(ps); 

                addXOutPs(reversed, fromX, ps);
                fromX = undefined;
            }

            // Move onto next bezier on current path
            curBez = reversed ? curBez.prev : curBez.next; 
            curT   = reversed ? 1 : 0;  
        }

        if (curBez === startBez && curT === startT) {
            break;
        }
    }

    return beziers;
}


/** @hidden */
function addXOutPs(reversed: boolean, fromX: X, ps: number[][]) {
    if (fromX && !fromX.isDummy) {
        let x = reversed ? fromX : fromX.opposite;
        x.outPs = ps;
        fromX = undefined;

        //_debug_.fs.draw.bezier(_debug_.generated.g, ps, 'red thin10 nofill');
    }
}


export { completeLoop }
