import { drawFs } from 'flo-draw';
import { CpNode } from '../../../cp-node/cp-node.js';
import { CpNodeFs } from '../../../cp-node/cp-node-fs.js';

const { getAllOnCircle } = CpNodeFs;


/** @internal */
function vertex(
		g: SVGGElement,
		cpNode: CpNode,
		classes?: string,
		delay = 0,
		scaleFactor = 1) {

	const circle = cpNode.cp.circle;

	let $svgs: SVGElement[] = [];

	// const $circle = drawFs.circle(g, circle, 'red ' + THIN + ' nofill ', delay);
	// const $crossHair = drawFs.crossHair(g, circle.center, 'red ' + THIN + ' nofill ', 3, delay);
	const $dot = drawFs.dot(g, circle.center, 0.01*scaleFactor, 'darkgreen', delay);

	$svgs = [...$dot];

	return $svgs;
}


export { vertex }
