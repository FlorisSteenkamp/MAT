'use strict'

const MAT_CONSTANTS = {
		// TODO - should be dynamic and of order of shape dimensions.
		maxOsculatingCircleRadius: 200,
		pointType: {
				'osculating'        : 0, // Osculating - Max curvatre inward,   
				'sharp'             : 1, // Sharp corner, 
				'dull'              : 2, // dull corner, 
				'reverseOsculating' : 3, // Osculating - Max curvature outward, 
				'standard'          : 4, // just another point
		}
}


module.exports = MAT_CONSTANTS;