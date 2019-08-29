
import { CpNode } from '../../../cp-node/cp-node';
import { drawFs } from 'flo-draw';


/** @hidden */
function vertex(g: SVGGElement, cpNode: CpNode, visible: boolean = true, displayDelay?: number) {
	let visibleClass = visible ? '' : ' invisible';

	let circle = cpNode.cp.circle;

	const THIN = 'thin20';

	let cps = cpNode.getCpNodesOnCircle();
	console.log(cps)

	let $svgs: SVGElement[] = [];

	let $circle = drawFs.circle(g, circle, 'red ' + THIN + ' nofill ' + visibleClass, displayDelay);
	let $crossHair = drawFs.crossHair(g, circle.center, 'red ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);

	$svgs = [...$circle, ...$crossHair];

	for (let i=0; i<cps.length; i++) {
		let cp = cps[i];
		let edgeCircle = cp.next.cp.circle;

		let $circle = drawFs.circle(g, edgeCircle, 'pink ' + THIN + ' nofill ' + visibleClass, displayDelay);
		let $crossHair = drawFs.crossHair(g, edgeCircle.center, 'pink ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);

		$svgs.push(...$circle, ...$crossHair)

		let p1 = circle.center;
		let p2 = edgeCircle.center;
		let thin = i === 0 ? 'thin10' : (i === 1 ? 'thin20' : 'thin35');
		let $line = drawFs.line(g, [p1, p2], 'yellow ' + thin  + ' nofill ' + visibleClass, displayDelay);

		$svgs.push(...$line);
	}

	return $svgs;
}


export { vertex }
