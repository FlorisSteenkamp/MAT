import { twoDiff, eEstimate, eMult, eAdd } from 'big-float-ts';
import { ddMultDd, ddAddDd } from 'double-double';


// We *have* to do the below to improve performance with bundlers❗ The assignee is a getter❗ The assigned is a pure function❗
const estimate = eEstimate;
const td = twoDiff;
// const emult = eMult;
// const eadd = eAdd;
const qmq = ddMultDd;
const qaq = ddAddDd;

const eps = Number.EPSILON;


/**
 * Returns the distance interval squared given the root interval (currently
 * ignoring multiplicity). 
 * 
 * * the result is returned as `[minPossibleSquared, maxPossibleSquared]` distance.
 * 
 * @param box
 * @param p
 * 
 * @internal
 */
function rootIntervalToDistanceSquaredInterval(
        pow: number,
        box: number[][], 
        p: number[]) {

    const bl = box[0];
    const tr = box[1];
    const minX = bl[0];
    const minY = bl[1];
    const maxX = tr[0];
    const maxY = tr[1];

    const x = p[0];  // <0>
    const y = p[1];  // <0>

    let minDSquared = Number.POSITIVE_INFINITY;
    let maxDSquared = Number.NEGATIVE_INFINITY;

    // for each corner of the interval box
    for (const [a,b] of [[minX,minY],[minX,maxY],[maxX,minY],[maxX,maxY]]) {
        /*
        // distance to 1st corner of interval box - `distance² = x² + y²`
        const dc1 = (a - x)**2 + (b - y)**2;
        // max absolute roundoff error of `dc1`
        // <4>dc1 <-- <4>(<3>(<1>(a - x)**2) + <3>(<1>((b - y)**2))
        const dc1E = 4*γ1*((a + x)**2 + (b + y)**2);
        const dc1Min = dc1 - dc1E;  // distance minus max error
        const dc1Max = dc1 + dc1E;  // distance plus max error
        */

        /** distance to 1st corner of interval box - `distance² = x² + y²` */
        const ax = td(a,x);  // a - x
        const by = td(b,y);  // b - y
        // const dc1Exact = eadd(emult(ax,ax),emult(by,by));  // ax**2 + bx**2
        // const dc1 = estimate(dc1Exact);
        const dc1Dd = qaq(qmq(ax,ax),qmq(by,by));  // ax**2 + bx**2
        const dc1 = dc1Dd[1];

        const dc1Min = dc1*(1 - 2**pow*eps);  // distance minus max error
        const dc1Max = dc1*(1 + 2**pow*eps);  // distance plus max error
        
        if (dc1Min <= minDSquared) {
            minDSquared = dc1Min;
        }

        if (dc1Max >= maxDSquared) {
            maxDSquared = dc1Max;
        }
    }

    return [minDSquared,maxDSquared];
}


export { rootIntervalToDistanceSquaredInterval }
