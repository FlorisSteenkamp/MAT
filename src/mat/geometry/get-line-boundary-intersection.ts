
import { CpNode } from '../..//cp-node';

import { getBoundaryPieceBeziers } from '../get-boundary-piece-beziers';
import { getLineBezierIntersection } from './get-line-bezier-intersection';


/**
 * Get intersection between line and boundary piece.
 * @param line A line described by two points
 * @param cpNodes A boundary piece described by start and end contact points
  */
function getLineBoundaryIntersectionPoints(
        line: number[][], cpNodes: CpNode[]) {

    let points = [];
    let bezierPieces = getBoundaryPieceBeziers(cpNodes);

    for (let i=0; i<bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];
        
        let ps = bezierPiece.curve.ps;
        let iPoints = getLineBezierIntersection(
                line, 
                ps, 
                bezierPiece.ts
        );
        
        for (let j=0; j<iPoints.length; j++) {
            points.push(iPoints[j].p);
        }
    }

    return points;
}


export { getLineBoundaryIntersectionPoints }
