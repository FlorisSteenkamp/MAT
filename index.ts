
import smoothen        from './lib/mat/functions/smoothen';
import findMat         from './lib/mat/functions/find-mat';
import toScaleAxis     from './lib/mat/functions/to-scale-axis';
import getNodesAsArray from './lib/mat/functions/get-nodes-as-array';

import MatTree         from './lib/mat/classes/mat-tree';
import PointOnShape    from './lib/geometry/classes/point-on-shape';
import LinkedLoop      from './lib/linked-list/linked-loop';
import ListNode        from './lib/linked-list/list-node';
import MatNode         from './lib/mat/classes/mat-node';
import PathCurve       from './lib/geometry/classes/path-curve';
import Shape           from './lib/geometry/classes/shape';
import Circle          from './lib/geometry/classes/circle';
import ContactPoint    from './lib/mat/classes/contact-point';
import BezierPiece     from './lib/geometry/classes/bezier-piece';
import Svg             from './lib/svg/svg';


const FloMat = {
	findMat,
	toScaleAxis,
	smoothen,
	getNodesAsArray,

	MatTree,
	PointOnShape,
	LinkedLoop,
	ListNode,
	MatNode,
	PathCurve,
	Shape,
	Circle,
	ContactPoint,
	BezierPiece,
	Svg,
};


export { findMat         };
export { toScaleAxis     };
export { smoothen        };
export { getNodesAsArray };

export { MatTree         };
export { PointOnShape    };
export { LinkedLoop      };
export { ListNode        };
export { MatNode         };
export { PathCurve       };
export { Shape           };
export { Circle          };
export { ContactPoint    };
export { BezierPiece     };
export { Svg             };


export default FloMat;
