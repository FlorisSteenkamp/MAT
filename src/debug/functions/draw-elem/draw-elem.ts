
import { PointOnShape } from '../../../point-on-shape';
import { CpNode       } from '../../../cp-node';
import { Loop         } from '../../../loop';

import { TwoProngForDebugging   } from '../../two-prong-for-debugging';
import { ThreeProngForDebugging } from '../../three-prong-for-debugging';
import { DebugElemType         } from '../../debug-elem-types';

import { oneProng         } from './one-prong';
import { twoProng         } from './two-prong';
import { threeProng       } from './three-prong';
import { vertex           } from './vertex';
import { minY             } from './min-y';
import { boundingHull     } from './bounding-hull';
import { looseBoundingBox } from './loose-bounding-box';
import { tightBoundingBox } from './tight-bounding-box';
import { sharpCorner      } from './sharp-corner';
import { dullCorner       } from './dull-corner';
import { mat              } from './mat';
import { oneProngAtDullCorner } from './one-prong-at-dull-corner';
import { loop             } from './loop';
import { loops            } from './loops';


export type TDrawElemFunctions = {
	[T in DebugElemType]: (g: SVGGElement, elem: any) => SVGElement[];
}

export interface IDrawElemFunctions extends TDrawElemFunctions {
	oneProng             : (g: SVGGElement, pos: PointOnShape) => SVGElement[],
	oneProngAtDullCorner : (g: SVGGElement, pos: PointOnShape) => SVGElement[],
	twoProng_regular     : (g: SVGGElement, twoProng: TwoProngForDebugging) => SVGElement[],
	twoProng_failed      : (g: SVGGElement, twoProng: TwoProngForDebugging) => SVGElement[],
	twoProng_notAdded    : (g: SVGGElement, twoProng: TwoProngForDebugging) => SVGElement[],
	twoProng_deleted     : (g: SVGGElement, twoProng: TwoProngForDebugging) => SVGElement[],
	twoProng_holeClosing : (g: SVGGElement, twoProng: TwoProngForDebugging) => SVGElement[],
	threeProng           : (g: SVGGElement, threeProng: ThreeProngForDebugging) => SVGElement[],
	minY                 : (g: SVGGElement, pos: PointOnShape) => SVGElement[],
	looseBoundingBox     : (g: SVGGElement, box: number[][]) => SVGElement[],
	tightBoundingBox     : (g: SVGGElement, box: number[][]) => SVGElement[],
	boundingHull         : (g: SVGGElement, hull: number[][], style?: string) => SVGElement[],
	sharpCorner          : (g: SVGGElement, pos: PointOnShape) => SVGElement[],
	dullCorner           : (g: SVGGElement, pos: PointOnShape) => SVGElement[],
	vertex               : (g: SVGGElement, node: CpNode, visible: boolean, displayDelay: number) => SVGElement[],
	loop                 : (g: SVGGElement, loop: Loop) => SVGElement[],
	loops                : (g: SVGGElement, loops: Loop[]) => SVGElement[],
}


let drawElemFunctions: IDrawElemFunctions = {
	oneProng,
	oneProngAtDullCorner,
	twoProng_regular: twoProng,
	twoProng_failed: twoProng,
	twoProng_notAdded: twoProng,
	twoProng_deleted: twoProng,
	twoProng_holeClosing: twoProng,
	threeProng,
	minY,
	boundingHull,
	looseBoundingBox,
	tightBoundingBox,
	sharpCorner,
	dullCorner,
	vertex,
	mat: mat('mat', true),
	sat: mat('sat', true),
	loop,
	loops
}


export { drawElemFunctions }
