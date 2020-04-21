
import { Loop } from '../loop';
import { getShapeBounds } from './get-shape-bounds';


/**
 * @hidden
 * Returns the max extreme point coordinate value for the given shape. This is
 * used for floating point tolerance calculations.
 * @param loops 
 */
function getExtreme(loops: Loop[]) {
	let bounds = getShapeBounds(loops);
	
	return Math.max(  
			Math.abs(bounds.minX.p[0]),
			Math.abs(bounds.minY.p[1]),
			Math.abs(bounds.maxX.p[0]),
			Math.abs(bounds.maxY.p[1])
	);
}


export { getExtreme }
