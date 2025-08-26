import { DebugElem, DebugElemKey } from '../../debug-elem-types.js';
import { drawOneProng } from './draw-one-prong.js';
import { drawTwoProng } from './draw-two-prong.js';
import { drawThreeProng } from './draw-three-prong.js';
import { vertex } from './draw-vertex.js';
import { minY } from './draw-min-y.js';
import { boundingHull } from './bounding-hull.js';
import { looseBoundingBox } from './draw-loose-bounding-box.js';
import { tightBoundingBox } from './draw-tight-bounding-box.js';
import { sharpCorner } from './draw-sharp-corner.js';
import { dullCorner } from './draw-dull-corner.js';
import { drawMat } from './draw-mat.js';
import { loop } from './draw-loop.js';
import { loops } from './draw-loops.js';
import { maxVertex } from './draw-max-vertex.js';
import { drawLeaves } from './draw-leaves.js';
import { drawCull } from './draw-cull.js';
import { drawBranch } from './draw-branch.js';
import { oneProngAtDullCorner } from './draw-one-prong-at-dull-corner.js';
import { drawCpNode } from './draw-cp-node.js';
import { drawSpeed } from './draw-speed.js';


type DrawElemFunction<T extends DebugElemKey> = (
	g: SVGGElement,
	elem: DebugElem[T],
	classes?: string,
	delay?: number,
	scaleFactor?: number,
	options?: any) => SVGElement[];


/** @internal */
type DrawElemFunctions = { [T in DebugElemKey]: DrawElemFunction<T> }


/** @internal */
const drawElemFs: DrawElemFunctions = {
	oneProng: drawOneProng,
	// oneProngAtDullCorner,
	// csf,
	twoProng: drawTwoProng(false, true),
	threeProng: drawThreeProng,
	boundingHull,
	looseBoundingBox,
	tightBoundingBox,
	// sharpCorner,
	// dullCorner,
	vertex,
	mat: drawMat,
	// sat: drawMat('sat'),
	maxVertex,
	leaves: drawLeaves,
	cull: drawCull,
	cpNode: drawCpNode,
	branch: drawBranch,
	holeCloser: drawTwoProng(false, false),
	speed: drawSpeed
}


const drawElemFsDetailed: DrawElemFunctions = {
	...drawElemFs,
	twoProng: drawTwoProng(true, true),
}


export { drawElemFs, drawElemFsDetailed, DrawElemFunctions }
