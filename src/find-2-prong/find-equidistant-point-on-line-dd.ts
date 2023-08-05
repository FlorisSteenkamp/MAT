import {
	twoDiff, twoSum, twoProduct, doubleDivDouble, ddDivDd,
	ddAddDd, ddDiffDd, ddMultDd, ddMultBy2, ddMultDouble1
} from "double-double";


const { abs } = Math;

const td = twoDiff;
const tp = twoProduct;



/**
 * Returns the point on the line from y to x that is equidistant from y and z.
 * 
 * @internal
 * @param x
 * @param y
 * @param z
  */
function findEquidistantPointOnLineDd(
		x: number[],
		y: number[],
		z: number[]) {
	// Some basic algebra (not shown) finds the required point.
	
	// Swap axes if x and y are more aligned to y-axis than to x-axis.
	const swapAxes = abs(x[1] - y[1]) > abs(x[0] - y[0]);
	
	// Cache
	let x1: number;
	let x2: number;
	let y1: number;
	let y2: number;
	let z1: number;
	let z2: number;
	
	if (swapAxes) {
		x1 = x[1];	x2 = x[0];
		y1 = y[1];	y2 = y[0];
		z1 = z[1];	z2 = z[0];	
	} else {
		x1 = x[0];	x2 = x[1];
		y1 = y[0];	y2 = y[1];
		z1 = z[0];	z2 = z[1];
	}
	
	// a <= 1 (due to swapped axes)
	// const a = (x2 - y2) / (x1 - y1); 
	// const b = y2 - a*y1;
	// const c = (y1*y1 + y2*y2 - z1*z1 - z2*z2) + 2*b*(z2 - y2);
	// const d = y1 - z1 + a*(y2 - z2);
	// const t1 = c/(2*d);
	// const t2 = a*t1 + b;

	
	const a = ddDivDd(td(x2,y2),td(x1,y1)); 
	const b = ddDiffDd([0,y2], ddMultDouble1(y1,a));

	const c = ddAddDd(
		(ddDiffDd(
			ddAddDd(tp(y1,y1), tp(y2,y2)),
			ddAddDd(tp(z1,z1), tp(z2,z2))
		)),
		ddMultBy2(ddMultDd(b,(td(z2,y2))))
	);

	const d = ddAddDd(td(y1,z1), ddMultDd(a,td(y2,z2)));
	const t1 = ddDivDd(c,ddMultBy2(d));
	const t2 = ddAddDd(ddMultDd(a,t1), b);
	
	return swapAxes ? [t2[1],t1[1]] : [t1[1],t2[1]];
}


export { findEquidistantPointOnLineDd }
