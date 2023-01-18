import { 
	squaredDistanceBetweenPointAndLineSegment, squaredDistanceBetween 
} from 'flo-vector2d';


/**
 * @hidden
 */
function getClosestSquaredDistanceToRotatedRect(ps: number[][], p: number[]) {
	const ds = [0,1,2,3].map(i => squaredDistanceBetweenPointAndLineSegment(
			p, 
			[ps[i], ps[(i+1) % 4]]
		)				
	);
	
	const width  = squaredDistanceBetween(ps[0], ps[1]);
	const height = squaredDistanceBetween(ps[0], ps[3]);

	if (ds[0] <= height && ds[2] <= height && 
		ds[1] <= width  && ds[3] <= width) {

		return 0; // Inside rotated rect
	}

	return Math.min(...ds);
}


export { getClosestSquaredDistanceToRotatedRect }
