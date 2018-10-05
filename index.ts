
import { Mat          } from './src/mat';
import { Loop         } from './src/loop';
import { Curve        } from './src/curve';
import { CpNode       } from './src/cp-node';
import { PointOnShape } from './src/point-on-shape';
import { Circle       } from './src/circle';
import { ContactPoint } from './src/contact-point';
import { BezierPiece  } from './src/bezier-piece';
import { X            } from './src/x';

import { smoothen        } from './src/mat/smoothen/smoothen';
import { findMats        } from './src/mat/find-mat/find-mats';
import { trimMat 	     } from './src/mat/trim-mat';
import { toScaleAxis     } from './src/mat/to-scale-axis/to-scale-axis';

import { getBranches     } from './src/mat/get-branches';
import { traverseEdges   } from './src/mat/traverse-edges';
import { traverseVertices } from './src/mat/traverse-vertices';

import { MatDebug } from './src/debug/debug';
import { getPathsFromStr } from './src/svg/svg';

import { DebugElemType } from './src/debug/debug-elem-types';
import { IDrawElemFunctions } from './src/debug/functions/draw-elem/draw-elem';

import { CpNodeForDebugging } from './src/debug/cp-node-for-debugging';

import { ITiming } from './src/debug/debug';

import { 
	getClosestBoundaryPoint, 
	closestPointOnBezier 
} from './src/mat/get-closest-boundary-point';


import * as Svg from './src/svg/svg';


export { 
	Mat,
	PointOnShape,
	Curve,
	Loop,
	CpNode,
	Circle,
	ContactPoint,
	BezierPiece,

	findMats,
	toScaleAxis,
	trimMat,
	smoothen,
	traverseVertices,
	getBranches,
	traverseEdges,

	MatDebug,

	Svg,
	getPathsFromStr,

	DebugElemType,
	IDrawElemFunctions,

	CpNodeForDebugging,
	ITiming,

	getClosestBoundaryPoint, 
	closestPointOnBezier,

	X
}

