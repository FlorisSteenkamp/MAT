
import { IDebugElems      } from '../../debug-elem-types';
import { drawOneProng     } from './one-prong';
import { twoProng         } from './two-prong';
import { threeProng       } from './three-prong';
import { vertex           } from './vertex';
import { minY             } from './min-y';
import { boundingHull     } from './bounding-hull';
import { looseBoundingBox } from './loose-bounding-box';
import { tightBoundingBox } from './tight-bounding-box';
import { sharpCorner      } from './sharp-corner';
import { dullCorner       } from './dull-corner';
import { drawMat          } from './mat';
import { loop             } from './loop';
import { loops            } from './loops';
import { maxVertex        } from './max-vertex';
import { leaves           } from './leaves';
import { culls            } from './culls';
import { oneProngAtDullCorner } from './one-prong-at-dull-corner';


/** @hidden */
type TDrawElemFunctions = 
	{ [T in keyof IDebugElems]: (g: SVGGElement, elem: IDebugElems[T], classes?: string, delay?: number) => SVGElement[] };


/** @hidden */
function notImplementedYet<T extends IDebugElems[keyof IDebugElems]> (g: SVGElement, elem: T) {
	return [] as SVGElement[]; // TODO - implement relevant drawing function
}


/** @hidden */
let drawElemFunctions: TDrawElemFunctions = {
	oneProng: drawOneProng,
	oneProngAtDullCorner,
	
	twoProng_regular: twoProng,
	twoProng_failed: twoProng,
	twoProng_notAdded: twoProng,
	twoProng_deleted: twoProng,
	twoProng_holeClosing: twoProng,
	threeProng,
	//minY,
	boundingHull,
	looseBoundingBox,
	tightBoundingBox,
	sharpCorner,
	dullCorner,
	vertex,
	mat: drawMat('mat'),
	sat: drawMat('sat'),
	//loop,
	//loops,
	maxVertex,
	leaves,
	culls,
	cpNode: notImplementedYet
}


export { drawElemFunctions, TDrawElemFunctions }
