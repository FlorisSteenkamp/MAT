//---- Constants
let MAT_CONSTANTS   = require('./mat-constants.js');

//---- Functions 
let smoothen        = require('./mat/functions/smoothen.js');
let findMat         = require('./mat/functions/find-mat.js');
let toScaleAxis     = require('./mat/functions/to-scale-axis.js');

//---- Classes - can be instantiated
let Bezier          = require('./geometry/classes/bezier.js');
let MatNode         = require('./mat/classes/mat-node.js');
let Mat             = require('./mat/classes/mat.js');
let MatCircle       = require('./mat/classes/mat-circle.js');
let ContactPoint    = require('./mat/classes/contact-point.js');
let getNodesAsArray = require('./mat/functions/get-nodes-as-array.js');
let PointOnShape    = require('./geometry/classes/point-on-shape.js');
let LinkedLoop      = require('./linked-loop/linked-loop.js');
let LlRbTree        = require('./ll-rb-tree//ll-rb-tree.js');
let Shape           = require('./geometry/classes/shape.js');
let Circle          = require('./geometry/classes/circle.js');
let Svg             = require('./svg/svg.js');

//---- Namespaced utilities
let Geometry        = require('./geometry/geometry.js');
let Util            = require('./utils.js');
let Vector          = require('./vector/vector.js');
let Poly            = require('./polynomial/polynomial.js');


//---- Expose our library to the global scope for browsers
// See: http://www.mattburkedev.com/export-a-global-to-the-window-object-with-browserify/

var MatLib = window.MatLib || {};

MatLib = Object.assign(MatLib, {
	// To be set by the user of the library if required.
	_debug_: undefined, 
	
	findMat,
	smoothen,
	toScaleAxis,

	Bezier,
	Mat,
	MatCircle,
	ContactPoint,	
	PointOnShape,
	LinkedLoop,
	LlRbTree,
	Shape,
	Circle,
	Svg,
	
	Geometry,
	Util,
	Vector,
	Poly,
	
	fs: {
		getNodesAsArray,
	}
});


//Replace/Create the global namespace
window.MatLib = MatLib;












