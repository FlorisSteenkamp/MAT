import { fromTo, circumCenter, len, scale, translate } from 'flo-vector2d';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { CurvePiece  } from '../mat/curve-piece.js';
import { getClosestPoints } from './get-closest-points.js';


/**
 * @internal
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
        bezierPiece3s: CurvePiece[][], 
        x: number[], 
        vectorToZeroV: number[]) {

    const V = len(vectorToZeroV);

    let nu = 1;
    let better;
    let newX;
    let newPoss: PointOnShape[];
    let newV;
    let i = 0; // Safeguard
    do { 
        const shift = scale(vectorToZeroV, nu);
        newX = translate(shift, x); 
        
        
        newPoss = getClosestPoints(newX, bezierPiece3s);

        // Point of zero V
        const newCircleCenter = circumCenter(newPoss.map(pos => pos!.p)); 
        const newVectorToZeroV = fromTo(newX, newCircleCenter);
        newV = len(newVectorToZeroV);
        
        better = newV < V;
        
        nu = nu/2;
        
        i++;
    } while (!better && i < 3);

    return { newX, newV, newPoss } 
}


export { calcBetterX }
