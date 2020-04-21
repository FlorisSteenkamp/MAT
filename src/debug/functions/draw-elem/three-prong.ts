
import { ThreeProngForDebugging } from '../../three-prong-for-debugging';

import { Circle, scaleCircle } from '../../../circle';
import { drawFs } from 'flo-draw';


/** @hidden */
const scaleFactor = 0.3;


/** @hidden */
function threeProng(g: SVGGElement, threeProng: ThreeProngForDebugging) {
	let circle = scaleCircle(
		threeProng.circle,
		1
	);
	let poss = threeProng.poss;
		
	let $cp1 = drawFs.dot(g, poss[0].p, 0.1*1*scaleFactor, 'blue');
	let $cp2 = drawFs.dot(g, poss[1].p, 0.1*2*scaleFactor, 'blue');
	let $cp3 = drawFs.dot(g, poss[2].p, 0.1*3*scaleFactor, 'blue');
	let $center = drawFs.dot(g, circle.center, 0.3*scaleFactor, 'blue');
	let $circle = drawFs.circle(g, circle, 'blue thin2 nofill');
		
	return [...$center, ...$cp1, ...$cp2, ...$cp3, ...$circle];
}		


export { threeProng }
