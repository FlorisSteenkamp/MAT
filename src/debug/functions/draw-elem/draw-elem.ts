import { IDebugElems      } from '../../debug-elem-types.js';
import { drawOneProng     } from './one-prong.js';
import { twoProng         } from './two-prong.js';
import { threeProng       } from './three-prong.js';
import { vertex           } from './vertex.js';
import { minY             } from './min-y.js';
import { boundingHull     } from './bounding-hull.js';
import { looseBoundingBox } from './loose-bounding-box.js';
import { tightBoundingBox } from './tight-bounding-box.js';
import { sharpCorner      } from './sharp-corner.js';
import { dullCorner       } from './dull-corner.js';
import { drawMat          } from './mat.js';
import { loop             } from './loop.js';
import { loops            } from './loops.js';
import { maxVertex        } from './max-vertex.js';
import { leaves           } from './leaves.js';
import { culls            } from './culls.js';
import { oneProngAtDullCorner } from './one-prong-at-dull-corner.js';


/** @internal */
type TDrawElemFunctions = 
	{ [T in keyof IDebugElems]: (
		g: SVGGElement,
		elem: IDebugElems[T],
		classes?: string,
		delay?: number,
		scaleFactor?: number) => SVGElement[] };


/** @internal */
function notImplementedYet<T extends IDebugElems[keyof IDebugElems]> (g: SVGElement, elem: T) {
	return [] as SVGElement[];
}


/** @internal */
const drawElemFunctions: TDrawElemFunctions = {
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
