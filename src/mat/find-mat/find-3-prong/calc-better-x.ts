
import { fromTo, circumCenter, len, scale, translate } from 'flo-vector2d';

import { IPointOnShape } from '../../../point-on-shape';
import { BezierPiece  } from '../../bezier-piece';

import { getClosestPoints } from './get-closest-points';


/**
 * @hidden
 * Find new x and ps that are a better estimate of the 3-prong circle.
 * The potential function, V, is defined as the distance to the actual 3 prong 
 * circle center.
 * @param bezierPiece3s The three boundary pieces, each of which should contain 
 * a point of the 3-prong to be found.
 * @param x The currently best guess at the center of the 3-prong circle.
 * @param vectorToZeroV
 * @param extreme
 */
function calcBetterX(
        bezierPiece3s: BezierPiece[][], 
        x: number[], 
        vectorToZeroV: number[]) {

    let V = len(vectorToZeroV);

    let nu = 1;
    let better;
    let newX;
    let newPs: IPointOnShape[];
    let newV;
    let i = 0; // Safeguard
    do { 
        let shift = scale(vectorToZeroV, nu);
        newX = translate(shift, x); 
        
        
        newPs = getClosestPoints(newX, bezierPiece3s);
                    
        // Point of zero V
        let newCircleCenter = circumCenter(newPs.map(pos => pos.p)); 
        let newVectorToZeroV = fromTo(newX, newCircleCenter);
        newV = len(newVectorToZeroV);
        
        better = newV < V;
        
        nu = nu/2;
        
        i++;
    } while (!better && i < 3);

    return { newX, newV, newPs } 
}


export { calcBetterX }
