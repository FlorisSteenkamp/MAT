import { drawFs } from 'flo-draw';
import { TwoProngForDebugging   } from '../../two-prong-for-debugging.js';
import { getTwoProngType } from '../../../mat/get-two-prong-type.js';


/** @internal */
function twoProng(
		g: SVGGElement,
		twoProng: TwoProngForDebugging,
        classes?: string,
        delay = 0,
        scaleFactor = 1) {

	let $failedDot : SVGElement[] = [];
	let $center    : SVGElement[] = [];
	let $circle    : SVGElement[] = [];
	let $cp1       : SVGElement[] = [];
	let $cp2       : SVGElement[] = [];
	
	let color;
	let thin;

	switch (getTwoProngType(twoProng)) {
		case 'twoProng_regular': {
			color = 'red ';
			thin = '2';
			break;
		}
		case 'twoProng_holeClosing': {
			color = 'cyan ';
			thin = '10';
			break;
		}		
	}
		
	
	if (twoProng.failed) {
		$failedDot = drawFs.dot(g, twoProng.pos.p, 1*scaleFactor, 'black', delay);
	} else if (!twoProng.failed) {
		$center = drawFs.dot   (g, twoProng.circle.center, 0.01*scaleFactor, 'yellow', delay);
		$circle = drawFs.circle(g, twoProng.circle, color + 'thin' + thin + ' nofill', delay); 
		$cp1    = drawFs.dot   (g, twoProng.pos.p, 0.0175*scaleFactor, color, delay);
		$cp2    = drawFs.dot   (g, twoProng.z, 0.035*scaleFactor, color, delay);	
	}
	
	return [...$failedDot, ...$center, ...$circle, ...$cp1, ...$cp2];	
}


export { twoProng }
