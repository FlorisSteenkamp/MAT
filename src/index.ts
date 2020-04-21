
import { Mat } from './mat';
import { Loop } from './loop';
import { Curve } from './curve';
import { CpNode } from './cp-node';
import { PointOnShape, IPointOnShape } from './point-on-shape';
import { Circle } from './circle';
import { ContactPoint } from './contact-point';
import { BezierPiece } from './mat/bezier-piece';

import { findMats } from './find-mats';
import { trimMat } from './mat/trim-mat';
import { toScaleAxis } from './to-scale-axis';

import { traverseEdges } from './traverse-edges';
import { getBranches } from './get-branches';
import { traverseVertices } from './traverse-vertices';

import { Debug, enableDebugForMat } from './debug/debug';
import { drawBranch } from './debug/functions/draw-elem/branch';
import { drawMat } from './debug/functions/draw-elem/mat';

import { IDebugElems } from './debug/debug-elem-types';
import { TDrawElemFunctions } from './debug/functions/draw-elem/draw-elem';

import { ICpNodeForDebugging } from './debug/cp-node-for-debugging';

import { ITiming } from './debug/debug';

import { getClosestBoundaryPoint } from 
	'./mat/closest-boundary-point/get-closest-boundary-point';

import { beziersToSvgPathStr, getPathsFromStr } from 'flo-boolean';	
import { getShapeBounds } from './svg/get-shape-bounds';

import { getBoundaryBeziersToNext } from './get-boundary-beziers-to-next';
import { getBoundaryBezierPartsToNext } from './get-boundary-bezier-parts-to-next';
import { getBoundaryPieceBeziers } from './mat/get-boundary-piece-beziers';
import { simplifyMat } from './simplify-mat';
import { simplifyMatMapOnly } from './mat/simplify-mat-map-only';

import { drawElemFunctions } from './debug/functions/draw-elem/draw-elem'

import { getCurveToNext } from './get-curve-to-next';
import { getCurveBetween } from './get-curve/get-curve-between';
import { sweepLine } from './sweep-line/sweep-line';
import { areBoxesIntersecting } from './sweep-line/are-boxes-intersecting';
import { getClosestSquareDistanceToRect } from './mat/geometry/get-closest-square-distance-to-rect';
import { loopFromBeziers } from './loop';


export { 
	// Data structures
	Mat,
	PointOnShape,
	IPointOnShape,
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
	simplifyMatMapOnly,

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
	Debug,
	IDebugElems,
	TDrawElemFunctions,
	ICpNodeForDebugging,
	ITiming,

	getBoundaryPieceBeziers,

	drawElemFunctions,

	sweepLine,
	areBoxesIntersecting,

	getClosestSquareDistanceToRect,

	loopFromBeziers,
	enableDebugForMat
}
