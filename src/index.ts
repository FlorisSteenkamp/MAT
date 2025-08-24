import { beziersToSvgPathStr, getPathsFromStr } from 'flo-boolean';	

import { Mat } from './mat/mat.js';
import { Loop } from 'flo-boolean';
import { Curve } from './curve/curve.js';
import {
	CpNode,
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
	getProngCount,
	getRealProngCount,
	cpNodeComparator,
	removeCpNode
} from './cp-node/cp-node.js';
import { createCpNode } from './cp-node/create-cp-node.js';
import { enhanceCpNode } from './cp-node/enhance-cp-node.js';
import { traverseCp } from './cp-node/traverse-cp.js';
import { PointOnShape } from './point-on-shape/point-on-shape.js';
import { createPos } from './point-on-shape/create-pos.js';
import { Circle } from './geometry/circle.js';
import { ContactPoint } from './contact-point/contact-point.js';
import { BezierPiece } from './mat/bezier-piece.js';
import { findMats } from './find-mat/find-mats.js';
import { trimMat } from './mat/trim-mat.js';
import { toScaleAxis } from './sat/to-scale-axis.js';
import { traverseEdges } from './cp-node/traverse-edges.js';
import { getBranches } from './mat/get-branches.js';
import { traverseVertices } from './cp-node/traverse-vertices.js';
import { Debug, enableDebugForMat } from './debug/debug.js';
import { drawBranch } from './debug/functions/draw-elem/branch.js';
import { drawMat } from './debug/functions/draw-elem/mat.js';
import { IDebugElems } from './debug/debug-elem-types.js';
import { TDrawElemFunctions } from './debug/functions/draw-elem/draw-elem.js';
import { ICpNodeForDebugging } from './debug/cp-node-for-debugging.js';
import { ITiming } from './debug/debug.js';
import { getClosestBoundaryPointCertified } from './closest-boundary-point/get-closest-boundary-point-certified.js';
import { getShapeBounds } from './svg/get-shape-bounds.js';
import { getBoundaryBeziersToNext } from './cp-node/get-boundary-beziers-to-next.js';
import { getBoundaryBezierPartsToNext } from './cp-node/get-boundary-bezier-parts-to-next.js';
import { getBoundaryPieceBeziers } from './mat/get-boundary-piece-beziers.js';
import { simplifyMat } from './mat/simplify-mat.js';
import { simplifyMatMapOnly } from './mat/simplify-mat-map-only.js';
import { drawElemFunctions } from './debug/functions/draw-elem/draw-elem.js';
import { getCurveToNext } from './cp-node/get-curve-to-next.js';
import { getCurveBetween } from './get-curve/get-curve-between.js';
import { sweepLine } from './sweep-line/sweep-line.js';
import { getClosestSquareDistanceToRect } from './geometry/get-closest-square-distance-to-rect.js';
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
	getProngCount,
	getRealProngCount,
	cpNodeComparator,
	removeCpNode,
	enhanceCpNode,
	traverseCp,


	// SVG functions
	beziersToSvgPathStr,
	getPathsFromStr,
	getShapeBounds, 
	drawBranch,
	drawMat,

	// Other functions
	getClosestBoundaryPointCertified,
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
