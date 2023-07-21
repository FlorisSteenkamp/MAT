import { beziersToSvgPathStr, getPathsFromStr } from 'flo-boolean';	

import { Mat } from './mat.js';
import { Loop } from 'flo-boolean';
import { Curve } from './curve.js';
import {
	CpNode,
	matCurveToNextVertex,
	getChildren,
	vertexChildren,
	getAllOnLoop,
	insertCpNode,
	getCpNodesOnCircle,
	isOnSameCircle,
	isTerminating,
	isFullyTerminating,
	getFirstExit,
	isSharp,
	isOneProng,
	getProngCount,
	getRealProngCount,
	cpNodeComparator,
	removeCpNode
} from './cp-node/cp-node.js';
import { createCpNode } from './cp-node/create-cp-node.js';
import { enhanceCpNode } from './cp-node/enhance-cp-node.js';
import { PointOnShape } from './point-on-shape/point-on-shape.js';
import { createPos } from './point-on-shape/create-pos.js';
import { Circle } from './circle.js';
import { ContactPoint } from './contact-point.js';
import { BezierPiece } from './mat/bezier-piece.js';
import { findMats } from './mat/find-mat/find-mats.js';
import { trimMat } from './mat/trim-mat.js';
import { toScaleAxis } from './to-scale-axis.js';
import { traverseEdges } from './traverse-edges.js';
import { getBranches } from './get-branches.js';
import { traverseVertices } from './traverse-vertices.js';
import { Debug, enableDebugForMat } from './debug/debug.js';
import { drawBranch } from './debug/functions/draw-elem/branch.js';
import { drawMat } from './debug/functions/draw-elem/mat.js';
import { IDebugElems } from './debug/debug-elem-types.js';
import { TDrawElemFunctions } from './debug/functions/draw-elem/draw-elem.js';
import { ICpNodeForDebugging } from './debug/cp-node-for-debugging.js';
import { ITiming } from './debug/debug.js';
import { getClosestBoundaryPoint } from './mat/closest-boundary-point/get-closest-boundary-point.js';
import { getShapeBounds } from './svg/get-shape-bounds.js';
import { getBoundaryBeziersToNext } from './get-boundary-beziers-to-next.js';
import { getBoundaryBezierPartsToNext } from './get-boundary-bezier-parts-to-next.js';
import { getBoundaryPieceBeziers } from './mat/get-boundary-piece-beziers.js';
import { simplifyMat } from './simplify-mat.js';
import { simplifyMatMapOnly } from './mat/simplify-mat-map-only.js';
import { drawElemFunctions } from './debug/functions/draw-elem/draw-elem.js';
import { getCurveToNext } from './get-curve-to-next.js';
import { getCurveBetween } from './get-curve/get-curve-between.js';
import { sweepLine } from './sweep-line/sweep-line.js';
import { getClosestSquareDistanceToRect } from './mat/geometry/get-closest-square-distance-to-rect.js';
import { loopFromBeziers } from 'flo-boolean';


export { 
	// Data structures
	Mat,
	PointOnShape,
	// IPointOnShape,
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

	// CpNode
	createCpNode,
	matCurveToNextVertex,
	getChildren,
	vertexChildren,
	getAllOnLoop,
	insertCpNode,
	getCpNodesOnCircle,
	isOnSameCircle,
	isTerminating,
	isFullyTerminating,
	getFirstExit,
	isSharp,
	isOneProng,
	getProngCount,
	getRealProngCount,
	cpNodeComparator,
	removeCpNode,
	enhanceCpNode,

	// SVG functions
	beziersToSvgPathStr,
	getPathsFromStr,
	getShapeBounds, 
	drawBranch,
	drawMat,

	// Other functions
	getClosestBoundaryPoint, 
	getCurveToNext, getCurveBetween,
	createPos,

	// Debug
	Debug,
	IDebugElems,
	TDrawElemFunctions,
	ICpNodeForDebugging,
	ITiming,

	getBoundaryPieceBeziers,

	drawElemFunctions,

	sweepLine,

	getClosestSquareDistanceToRect,

	loopFromBeziers,
	enableDebugForMat
}
