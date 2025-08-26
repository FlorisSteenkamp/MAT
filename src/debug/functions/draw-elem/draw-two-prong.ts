import { drawFs } from 'flo-draw';
import { CpNode } from '../../../cp-node/cp-node.js';


/** @internal */
function drawTwoProng(
		drawCrosshair: boolean,
		drawSpokes: boolean) {

	return (g: SVGGElement,
			twoProng: CpNode,
			classes?: string,
			delay = 0,
			scaleFactor = 1) => {

		let color;
		let thin;

		switch (twoProng.isHoleClosing) {
			case false: {
				color = 'red ';
				thin = '2';
				break;
			}
			case true: {
				color = 'cyan ';
				thin = '10';
				break;
			}		
		}

		const cp = twoProng.cp;
		const { circle, pointOnShape: pos } = cp;
		const { center: c, radius: r } = circle;
		const { isSource, p } = pos;
		const p2 = twoProng.nextOnCircle.cp.pointOnShape.p;
		const pS = isSource ? p : p2;
		const pA = isSource ? p2 : p;
		
		const { line, dot, circle: drawCircle, crossHair } = drawFs;
		
		const $center = dot   (g, circle.center, 0.02*scaleFactor, 'yellow', delay);
		const $circle = drawCircle(g, circle, color + 'thin' + thin + ' nofill', delay); 
		const $cp1    = dot   (g, pS, 0.005*scaleFactor, color, delay);
		const $cp2    = dot   (g, pA, 0.01*scaleFactor, color, delay);

		// const $l1 = drawSpokes ? line(g, [pS, c], 'thin5 red nofill', delay) : [];
		// const $l2 = drawSpokes ? line(g, [pA, c], 'thin5 red nofill', delay) : [];

		const $cross = drawCrosshair
			? crossHair(g, circle.center, 'red thin2 nofill', 0.002*scaleFactor, delay)
			: [];
		
		return [
			...$circle,
			...$cp1,
			...$cp2,
			// ...$l1,
			// ...$l2,
			...$cross,
			...$center
		];
	}
}


export { drawTwoProng }
