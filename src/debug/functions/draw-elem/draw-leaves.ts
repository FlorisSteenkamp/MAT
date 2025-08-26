import { drawFs } from 'flo-draw';
import { CpNodeFs } from '../../../cp-node/cp-node-fs.js';
import { CpNode } from '../../../cp-node/cp-node.js';
import { drawCirclePercent } from './draw-circle-percent.js';


/** @internal */
function drawLeaves(
        g: SVGGElement,
        leaves: CpNode[],
        classes = 'thin10 deeppink nofill',
        delay = 0,
        scaleFactor = 1) {	

    const $elems: SVGElement[] = [];
    const { line, dot, circle: drawCircle } = drawFs;

    for (const cpNode of leaves) {
        const cp = cpNode.cp;
        const { circle } = cp;
        const { center: c, radius: r } = circle;

        const $center = [drawCirclePercent(g, c, 0.5, 'pinker thin5 nofill')];

        const poss = CpNodeFs.getAllOnCircle(cpNode)
            .map(cpNode => cpNode.cp.pointOnShape);

        const $ls: SVGElement[] = [];
        const $cps: SVGElement[] = [];
        for (let i=0; i<poss.length; i++) {
            const p = poss[i].p;
            $cps.push(...dot(g, p, 0.01*(i+1)*scaleFactor, 'pinker', delay));
            $ls.push(...line(g, [p, c], 'thin5 red', delay));
        }
		
		const $circle = drawCircle(g, circle, classes, delay); 
		// const $cp = dot(g, p, 0.005*scaleFactor, 'pinker', delay);

		$elems.push(...[
			...$circle,
			...$cps,
			...$ls,
			...$center
		]);
    }
    
	return $elems;
}


export { drawLeaves }
