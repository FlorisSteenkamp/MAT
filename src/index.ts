
import { Mat } from './mat';
import { Loop } from './loop/loop';
import { Curve } from './curve';
import { CpNode } from './cp-node/cp-node';
import { PointOnShape } from './point-on-shape';
import { Circle } from './circle';
import { ContactPoint } from './contact-point';
import { BezierPiece } from './bezier-piece';

import { findMats } from './find-mats';
import { trimMat } from './mat/trim-mat';
import { toScaleAxis } from './to-scale-axis';

import { traverseEdges } from './traverse-edges';
import { getBranches } from './get-branches';
import { traverseVertices } from './traverse-vertices';

import { MatDebug } from './debug/debug';
import { drawBranch } from './debug/functions/draw-elem/branch';
import { drawMat } from './debug/functions/draw-elem/mat';

import { IDebugElems } from './debug/debug-elem-types';
import { TDrawElemFunctions } from './debug/functions/draw-elem/draw-elem';

import { CpNodeForDebugging } from './debug/cp-node-for-debugging';

import { ITiming } from './debug/debug';

import { getClosestBoundaryPoint } from 
	'./mat/closest-boundary-point/get-closest-boundary-point';

import { getPathsFromStr } from './get-paths-from-str';	
import { beziersToSvgPathStr } from './beziers-to-svg-path-str';
import { getShapeBounds } from './svg/fs/get-shape-bounds';

import { getBoundaryBeziersToNext } from './get-boundary-beziers-to-next';
import { getBoundaryBezierPartsToNext } from './get-boundary-bezier-parts-to-next';
import { getBoundaryPieceBeziers } from './mat/get-boundary-piece-beziers';
import { simplifyMat } from './simplify-mat';

import { drawElemFunctions } from './debug/functions/draw-elem/draw-elem'

import { getCurveToNext } from './get-curve/get-curve-to-next';
import { getCurveBetween } from './get-curve/get-curve-between';


export { 
	// Data structures
	Mat,
	PointOnShape,
	Curve,
	Loop,
	CpNode,
	Circle,
	ContactPoint,
	BezierPiece,

	// Main functions
	findMats,
	toScaleAxis,
	trimMat,
	traverseVertices,
	traverseEdges,
	getBranches,
	getBoundaryBeziersToNext,
	getBoundaryBezierPartsToNext,
	simplifyMat,

	// SVG functions
	beziersToSvgPathStr,
	getPathsFromStr,
	getShapeBounds, 
	drawBranch,
	drawMat,

	// Other functions
	getClosestBoundaryPoint, 
	getCurveToNext, getCurveBetween,

	// Debug
	MatDebug,
	IDebugElems,
	TDrawElemFunctions,
	CpNodeForDebugging,
	ITiming,

	getBoundaryPieceBeziers,

	drawElemFunctions
}
