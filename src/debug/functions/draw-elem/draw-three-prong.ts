import { drawFs } from 'flo-draw';
import { scaleCircle } from '../../../geometry/circle.js';
import { CpNode } from '../../../cp-node/cp-node.js';
import { CpNodeFs } from '../../../cp-node/cp-node-fs.js';


/** @internal */
function drawThreeProng(
		g: SVGGElement,
		// threeProng: ThreeProngForDebugging,
		threeProng: CpNode,
		classes?: string,
		delay = 0,
		scaleFactor = 1) {

	const circle = scaleCircle(
		threeProng.cp.circle,
		1
	);
	const { center: c, radius: r } = circle;
	
	// const poss = threeProng.poss;
	const poss = CpNodeFs.getAllOnCircle(threeProng)
        .map(cpNode => cpNode.cp.pointOnShape)

	const { dot, circle: drawCircle, crossHair } = drawFs;

	const $circle = drawCircle(g, circle, 'blue thin2 nofill', delay);

	const $cps: SVGElement[] = [];
	const $ls: SVGElement[] = [];
	for (let i=0; i<poss.length; i++) {
		const p = poss[i].p;
		$cps.push(...dot(g, p, 0.01*(i+1)*scaleFactor, 'blue', delay));
		$ls.push(...drawFs.line(g, [p, c], 'thin5 red', delay));
	}
    
	const $cross = crossHair(g, circle.center, 'red thin2 nofill', 0.02*scaleFactor, delay);
		
	return [...$cps, ...$ls, ...$circle, ...$cross] as SVGElement[];
}		


export { drawThreeProng }
