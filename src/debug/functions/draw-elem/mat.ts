
declare let _debug_: MatDebug; 

import { MatDebug } from '../../debug';

import { CpNode } from "../../../cp-node";
import { Mat    } from '../../../mat';

import { traverseEdges } from "../../../traverse-edges";



function mat(type: 'mat' | 'sat', smooth: boolean) {

    let classes: string = type === 'mat'
        ? 'thin5 purple nofill'
        : 'thin10 red nofill';

    return f;


    function f(g: SVGGElement, mat: Mat) {
        let cpNode = mat.cpNode;
        
        if (!cpNode) { return undefined; }

        let draw = _debug_.fs.draw;
        
        let $svgs: SVGElement[] = [];

        //const DRAW_CLASS_LINE = 'thin20 blue1 nofill';
        //const DRAW_CLASS_QUAD = 'thin20 blue2 nofill';
        //const DRAW_CLASS_CUBE = 'thin20 blue3 nofill';

        traverseEdges(cpNode, function(cpNode) {
            if (cpNode.isTerminating()) { return; }
    
            if (!smooth) {
                let p1 = cpNode     .cp.circle.center;
                let p2 = cpNode.next.cp.circle.center;

                $svgs.push( ...draw.line(g, [p1, p2], classes) );

                return;
            } 

            let bezier = cpNode.matCurveToNextVertex;

            if (!bezier) { return; }
            
            let fs = [,,draw.line, draw.quadBezier, draw.bezier];
            
            $svgs.push( ...fs[bezier.length](g, bezier, classes) );
        });
        
        return $svgs;
    }
}


export { mat }
