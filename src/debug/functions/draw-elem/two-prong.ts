
declare let _debug_: MatDebug; 

import { MatDebug } from '../../debug';

import { TwoProngForDebugging   } from '../../two-prong-for-debugging';

import { getTwoProngType } from '../../../mat/get-two-prong-type';


function twoProng(g: SVGGElement, twoProng: TwoProngForDebugging) {
	//let scaleFactor = width/200;		
	let scaleFactor = 0.3;

	let $failedDot : SVGElement[] = [];
	let $center    : SVGElement[] = [];
	let $circle    : SVGElement[] = [];
	let $cp1       : SVGElement[] = [];
	let $cp2       : SVGElement[] = [];
	
	let color;
	let thin;

	let draw = _debug_.fs.draw;

	switch (getTwoProngType(twoProng)) {
		case 'twoProng_regular': {
			color = 'red ';
			thin = '2';
			break;
		}
		case 'twoProng_failed': {
			$failedDot = draw.dot(
				g, twoProng.pos.p, 1*scaleFactor, 'black'
			);
			return;
		}
		case 'twoProng_notAdded': {
			color = 'brown ';
			thin = '10';
			break;
		}
		case 'twoProng_deleted': {
			color = 'gray ';
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
		$failedDot = draw.dot(g, twoProng.pos.p, 1*scaleFactor, 'black');
	} else if (!twoProng.failed) {
		$center = draw.dot   (g, twoProng.circle.center, 0.05*scaleFactor, 'yellow');
		$circle = draw.circle(g, twoProng.circle, color + 'thin' + thin + ' nofill'); 
		$cp1    = draw.dot   (g, twoProng.pos.p, 0.035*scaleFactor, color);
		$cp2    = draw.dot   (g, twoProng.z, 0.07*scaleFactor, color);	
	}
	
	return [...$failedDot, ...$center, ...$circle, ...$cp1, ...$cp2];	
}


export { twoProng }
