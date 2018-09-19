
declare var _debug_: MatDebug; 

import { MatDebug }   from '../debug/debug';

import { CpNode       } from '..//cp-node';
import { ContactPoint } from '../contact-point';


/**
 * Note: For debugging only
 * Checks the position of the ContactPoint (cp) on the boundary piece. 
 * Returns < 0 if the cp is not on δ, > 0 if it is on the boundary piece 
 * excluding the endpoints and 0 if it is on the endpoints. Also returns > 0 if
 * δ === undefined.
 * @param δ The boundary piece
 * @param cp The contact point
 */
function cmpCpOnδ(
        δ: CpNode[], 
        cp: ContactPoint) {

    if (δ[0] === undefined) { 
        return 1;
    }

    let cpBef = δ[0].cp;
    let cpAft = δ[1].cp;

    let cmp     = ContactPoint.compare(cpBef, cpAft); 
    let cmpPrev = ContactPoint.compare(cpBef, cp);
    let cmpNext = ContactPoint.compare(cp,    cpAft);
    
    if (cmp < 0) {
        if (cmpPrev > 0 || cmpNext > 0) {
            console.log(`2-PRONG (antipode) Order is wrong - cmpPrev and cmpNext should be > 0; cmp: ${cmp}, cmpPrev: ${cmpPrev}, cmpNext ${cmpNext}`);
            //_debug_.fs.draw.dot(cp.pointOnShape.p, 1, "blue");
            return -1;
        }
    } else if (cmp > 0) {
        if (cmpPrev > 0 && cmpNext > 0) {
            console.log(`2-PRONG (antipode) Order is wrong: ${cmpPrev}, ${cmpNext}`);
            //_debug_.fs.draw.dot(cp.pointOnShape.p, 1, "blue");
            return -1;
        }
    } 

    if (cmpPrev === 0 || cmpNext === 0) {
        console.log('2-PRONG orders are equal.');	
        return 0;
    }

    return 1;
}


export { cmpCpOnδ }
