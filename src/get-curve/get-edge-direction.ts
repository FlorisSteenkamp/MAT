import { 
    toUnitVector, fromTo, rotate, translate, rotate90Degrees, reverse, dot
} from 'flo-vector2d';
import { tangent } from 'flo-bezier3';
import { CpNode } from '../cp-node.js';
import { isPosSharpCorner } from '../point-on-shape.js';


/**
 * @hidden
 * Returns a line segment of unit length starting in the given Vertex center and
 * pointing in the direction of the medial axis (viewed as a rooted tree).
 * @param cpNode 
 */
function getEdgeDirection(cpNode: CpNode) {

    let circleCenter = cpNode.cp.circle.center;

    let cp1 = cpNode;
    let cp2 = cpNode.nextOnCircle;

    let pos1 = cp1.cp.pointOnShape;
    let pos2 = cp2.cp.pointOnShape;

    let p1 = pos1.p;
    let p2 = pos2.p;

    let vDir;
    
    //if (!PointOnShape.isSharpCorner(pos1)) {
    if (!isPosSharpCorner(pos1)) {
        if (p1[0] === p2[0] && p1[1] === p2[1]) {
            vDir = fromTo(p1, circleCenter); // A 1-prong
        } else {
            vDir = rotate90Degrees( fromTo(p1, p2) ); // not a 1-prong.
        }
    } else {
        let curve1;
        let curve2;
        // TODO - test if pos1.t can ever be 0 - it is terminating
        if (pos1.t === 0) {
            curve1 = pos1.curve;
            curve2 = pos1.curve.prev;
        } else if (pos1.t === 1) {
            curve1 = pos1.curve.next; 
            curve2 = pos1.curve;
        }

        let tan1 = toUnitVector(tangent(curve1.ps, 0));
        let tan2 = reverse( toUnitVector(tangent(curve2.ps, 1)) );
        
        let x = dot(tan1, tan2);
        // Recall the identities sin(acos(x)) = sqrt(1-x^2), etc. Also 
        // recall the half angle formulas. Then the rotation matrix, R, can 
        // be calculated.
        let cosθ = Math.sqrt((1+x)/2);
        let sinθ = Math.sqrt((1-x)/2);
        
        vDir = rotate(sinθ, cosθ, tan2);
    }

    let v = translate(
        toUnitVector(vDir),
        circleCenter 
    );

    return [circleCenter, v];
}


export { getEdgeDirection }
