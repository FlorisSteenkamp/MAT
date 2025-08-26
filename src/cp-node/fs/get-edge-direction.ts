import { 
    toUnitVector, fromTo, rotate, translate, rotate90Degrees, reverse, dot
} from 'flo-vector2d';
import { tangent } from 'flo-bezier3';
import { CpNode } from '../cp-node.js';
import { isPosSharpCorner } from '../../point-on-shape/is-pos-sharp-corner.js';
import { Curve } from '../../curve/curve.js';


function getEdgeDirection(cpNode: CpNode) {
    const circleCenter = cpNode.cp.circle.center;

    const cp1 = cpNode;
    const cp2 = cpNode.nextOnCircle;

    const pos1 = cp1.cp.pointOnShape;
    const pos2 = cp2.cp.pointOnShape;

    const p1 = pos1.p;
    const p2 = pos2.p;

    let vDir;
    
    if (!isPosSharpCorner(pos1)) {
        if (p1[0] === p2[0] && p1[1] === p2[1]) {
            vDir = fromTo(p1, circleCenter); // A 1-prong
        } else {
            vDir = rotate90Degrees( fromTo(p1, p2) ); // not a 1-prong.
        }
    } else {
        let curve1: Curve;
        let curve2: Curve;

        if (pos1.t === 0) {
            curve1 = pos1.curve;
            curve2 = pos1.curve.prev;
        } else if (pos1.t === 1) {
            curve1 = pos1.curve.next; 
            curve2 = pos1.curve;
        }

        const tan1 = toUnitVector(tangent(curve1!.ps, 0));
        const tan2 = reverse( toUnitVector(tangent(curve2!.ps, 1)) );
        
        const x = dot(tan1, tan2);
        // Recall the identities sin(acos(x)) = sqrt(1-x^2), etc. Also 
        // recall the half angle formulas. Then the rotation matrix, R, can 
        // be calculated.
        const cosθ = Math.sqrt((1 + x)/2);
        const sinθ = Math.sqrt((1 - x)/2);
        
        vDir = rotate(sinθ, cosθ, tan2);
    }

    const v = translate(
        toUnitVector(vDir),
        circleCenter 
    );

    return [circleCenter, v];
}


export { getEdgeDirection }
