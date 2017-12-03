
const MAT_CONSTANTS = {
		// TODO - should be dynamic and of order of shape dimensions.
		maxOsculatingCircleRadius: 800,
		pointType: {
				'standard' : 0, // Not special,   
				'sharp'    : 1, // Sharp corner, 
				'dull'     : 2, // dull corner,
				'extreme'  : 3, // Topmost point on loop
		}
}


export default MAT_CONSTANTS;
