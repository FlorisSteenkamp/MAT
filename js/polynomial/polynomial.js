'use strict'

let Util             = require('../utils.js');
let findCubicRoots01 = require('./functions/find-cubic-roots.js'); 


/**
* Functional univariate polynomial library functions.
*
* All polinomials are represented as a simple array starting with the 
* highest power, e.g. 
*   10x^4 + 3x^3 + 5x^2 + 7x + 0 -> [10,3,5,7,0]
*/
let Poly = {
	// Roots
	findQuadraticRoots01,
	findCubicRoots01,
	brent,
	positiveRootLowerBound,
	positiveRootUpperBound,
	zeroRoots,
	numRootsWithin,
	allRoots01,
	newton,
	rootsWithin,
	
	// Operators
	multiplyByConst,
	negate,
	minus,
	multiply,
	differentiate,
	sturmChain,
	degree,
	evaluate,
	evaluateAt0,
	signChanges,
	invert,
	changeVariables,
	deflate,
	
	remainder, 
};



/**  
 * Differentiation the given polynomial.
 **/
function differentiate(p) {
	
	let result = [];
	
	let d = p.length - 1;
	for (let i=d; i !== 0; i--) {
		let coeff = p[d-i] * i;
		if (i === d && coeff === 0) { 
			continue; 
		}
		
		result.push(coeff);
	}
	
	if (result.length === 0) { 
		return [0];
	}
	
	return result;
}


/** 
 * Multiplies 2 polynomials 
 */
function multiplyByConst(c, p) {
	if (c === 0) { return []; }
	
	let d = p.length - 1;
	let result = [];
	for (let i=d; i >= 0; i--) {
		result.push(c * p[d-i]);
	}
	return result;
};


function negate(poly) {
	return Poly.multiplyByConst(-1, poly);
}


/** 
 * Subtracts second from first polynomial 
 */
// TODO - ugly code - improve
function minus(poly1, poly2) {
	let d1 = poly1.length - 1;
	let d2 = poly2.length - 1;
	let dr = Math.max(d1,d2);
	let result = [];
	for (let i=0; i<dr+1; i++) {
		result.push(0);
	}
	
	for (let i=dr; i >= 0; i--) {
		let v1 = poly1[dr-i];
		let v2 = poly2[dr-i];
		result[dr-i] = (v1 ? v1 : 0) - (v2 ? v2 : 0);  
	}
	
	return result;
}


/** 
 * Multiplies poly1 and poly2 
 * 
 * Inefficient O(n^2) 
 * see https://en.wikipedia.org/wiki/Discrete_Fourier_transform#Polynomial_multiplication
 * 
 **/
function multiply(poly1, poly2) {
	let d1 = poly1.length - 1;
	let d2 = poly2.length - 1;
	let dr = d1+d2;
	let result = [];
	for (let i=0; i<dr+1; i++) {
		result.push(0);
	}
	
	for (let i=d1; i >= 0; i--) {
		for (let j=d2; j >= 0; j--) {
			result[dr-(i+j)] += (poly1[d1-i] * poly2[d2-j]); 				
		}
	}
	return result;
}


/** Returns degree of polynomial **/
// TODO - If leading coefficients are 0 this gives the wrong result
function degree(p) {
	return p.length-1;
}


/** 
 * Evaluates a univariate polynomial using Horner's method  
 * See: https://en.wikipedia.org/wiki/Horner%27s_method 
 **/
function evaluate(p) {
	return function(t) {
		let bn = p[0]; 
		for (let i=1; i<p.length; i++) {
			bn = p[i] + bn*t;
		}
		
		return bn;
	}
};


/** 
 * Evaluates a polynomial at 0 
 * - this is much faster than at an arbitrary point 
 */
function evaluateAt0(p) {
	return p[p.length - 1];
};


/** 
 * Returns the number of sign changes in the polynomial coefficents 
 * when order in descending order; zeros are ignored 
 */
function signChanges(p) {

	let result = 0;
	
	let d = p.length - 1;
	let curSign = 0;
	for (let i=d; i >= 0; i--) {
		let newSign = Math.sign(p[d-i]);
		if (newSign === 0) continue;
		if (curSign !== 0 && curSign !== newSign) {
			result++; 
		}
		curSign = newSign;
	}
	
	return result;
}


/** 
 * Returns the remainder when dividing poly1 by poly2 
 * ASSUMING poly1 is one degree higher than poly2.
 */
// See: https://en.wikipedia.org/wiki/Sturm%27s_theorem
function remainder(p1, p2) {
	//console.log(p1,p2)
	
	let d1 = p1.length - 1;  // Degree of p1
	let d2 = p2.length - 1;  // Degree of p2
	let d = d1 - d2;
	for (let i=0; i<d-1; i++) {
		p2.unshift(0);
	}
	d2 = d1-1;

	let pre1 = (p1[1]/p1[0] - p2[1]/p2[0]);
	let pre2 = p1;
	let pre3 = Poly.multiplyByConst(p1[0]/p2[0], p2);
	let pre4 = Poly.multiply(pre3, [1, pre1]);
	let pre5 = Poly.minus(pre4, pre2);
	
	return pre5.slice(2); 
}


function deflate(poly, root) {
	// Implement as a shortcut (can root === 1 also be a shortcut?)
	if (root === 0) {
		
	} 
	
	let d = poly.length-1;
	let bs = [poly[0]];
	for (let i=1; i<poly.length-1; i++) {
		bs.push(
			poly[i] + root*bs[i-1]
		);
	}

	//console.log(bs);
	return bs;
}

/** 
 * Generates a sturm chain for the given polynomial 
 */
function sturmChain(p) {
	let m = []; // Sturm chain
	m.push(p);
	m.push(Poly.differentiate(p));
	
	let i = 1;
	
	while (Poly.degree(m[i]) > 0) {
		m.push(Poly.remainder(m[i-1], m[i]));
		i++;
	}
	
	return m;
}


/** 
 * Returns the number of roots in the interval (a,b) of a 
 * polynomial 
 */ 
function numRootsWithin(p, a, b) {

	let sturmChain = Poly.sturmChain(p);
	let as = sturmChain.map(function(p) {
		return Poly.evaluate(p)(a);
	});
	let bs = sturmChain.map(function(p) {
		return Poly.evaluate(p)(b);
	});
	
	return Poly.signChanges(as) - Poly.signChanges(bs);
}


/** 
 * Newton's method - tuned for polynomials 
 * Currently just doing 10 iterations - only for testing at the
 * moment. 
 */
function newton(p, initialGuess) {
	let dp = Poly.differentiate(p);
	let val = initialGuess;
	for (let i=1; i <= 10; i++){
		val -= Poly.evaluate(p)(val) / Poly.evaluate(dp)(val);
	}
	
	return val;
}


/** 
 * See algoritm 6 - Vigklas
 * Note: Only polynomials that has at least 1 sign change can be 
 *       used in this algorithm. This is not a problem since if 
 *       there are no sign changes then there are no roots! 
 */
function positiveRootUpperBound(p) {
	let deg = p.length-1;
	if (deg < 1) { return 0; }
	
	if (p[0] < 0) { p = Poly.negate(p); }
	
	let timesUsed = [];
	for (let i=0; i<deg; i++) {
		timesUsed.push(1);
	}
	
	let ub = 0;
	
	for (let m=0; m<=deg; m++) {
		if (p[m] >= 0) continue;
		
		let tempub = Number.POSITIVE_INFINITY;
		let any = false;
		
		for (let k=0; k<m; k++) {
			if (p[k] <= 0) continue;
		
			// TODO - Both these pows can easily be replaced with a lookup that will speed things up a lot
			// since (for low order polys) it will most of the time be a square, cube... root or multiplication by 1,2,4,8,...
			// TODO - not 100% sure the timesUsed[k] is used correctly here but seems to give reasonable results
			let temp = Math.pow(-p[m] / (p[k] / Math.pow(2, timesUsed[k])), 1/(m-k));
			
			timesUsed[k]++;
			
			if (tempub > temp) { tempub = temp; }
			
			any = true;
		}
		
		if (any && ub < tempub)  
			ub = tempub;
	}
	
	return ub;
}


/**
 * p(x) -> x^deg(p) * p(1/x)
 */
function invert(p) {
	let len = p.length;
	let newP = [];
	
	for (let i=len-1; i>=0; i--) {
		newP.push(p[i]);
	}
	
	return newP;
}


/** 
 * See http://stackoverflow.com/questions/141422/how-can-a-transform-a-polynomial-to-another-coordinate-system 
 * This is basically just a change of variables (type of Mobius transform) of the type: 
 *   p(x) <- p(ax + b)
 * Currently limited to degree 6 or so (due to binomial coeff lookup), but easiliy extensible to any degree with 1 line of code :)
 * 
 * We let the coefficients of p(ax + b) =def= d_i in the code below. d_i is calculated as d = T*c, where c is the original coefficients 
 **/
function changeVariables(p, a, b) {
	let deg = p.length-1;
	
	
	let d = new Array(deg+1).fill(0);
	//let d = [];
	// TODO - better way to fill a matrix with zeros?
	let t = [];
	for (let i=0; i<deg+1; i++) {
		t.push(new Array(deg+1).fill(0));
		//d.push(0);
		/*t.push([]);
		for (let j=0; j<deg+1; j++) {
			t[i].push(0);
		}*/
	}

	
	// Calculate the triangular matrix T
	t[0][0] = 1;
	for (let j=1; j<=deg; j++) {
		t[0][j] = b*t[0][j-1];
		for (let i=1; i<=j; i++) {
			t[i][j] = b*t[i][j-1] + a*t[i-1][j-1];
		}
	}
	
	// Multiply
	for (let i=0; i<=deg; i++) {
		d[deg-i] = 0;
		for (let j=i; j<=deg; j++) {
			let acc = t[i][j] * p[deg-j];
			d[deg-i] += acc;
		}
	}
	
	return d;
}


function positiveRootLowerBound(p) {
	return 1 / (Poly.positiveRootUpperBound(Poly.invert(p)));
}


/**
 * @return { Number, Array } The number of zero roots together with the 
 * deflated polynomial
 *       
 */
function zeroRoots(p) {
	let p_ = p.slice();
	let i = 0;
	while (Poly.evaluateAt0(p_) === 0) {
		let len = p_.length;
		p_.splice(len-1, 1);
		i++;
	}
	return {
		p: p_,
		numZeros: i,
	}	
}



/**
 * Find 2nd order or higher polynomial roots within the 
 * *specific interval** [0,1]. 
 */
function allRoots01(poly) {

	let deg = poly.length-1;
	
	if (deg === 2) {
		return Poly.findQuadraticRoots01(poly); 
	} else if (deg === 3) {
		return Poly.findCubicRoots01(poly).sort(function(a,b) {
			return a - b;
		});
	}
	
	
	let diff = Poly.differentiate(poly); 
	let roots = allRoots01(diff);
	if (roots[0] !== 0) {
		roots.unshift(0);
	}
	if (roots[roots.length-1] !== 1) {
		roots.push(1);
	}
	
	return rootsWithin(poly, roots);
}


function rootsWithin(poly, intervals) {

	let len = intervals.length;
	let roots = [];
	let peval = Poly.evaluate(poly);
	
	for (let i=0; i<len-1; i++) {
		let a = intervals[i];
		let b = intervals[i+1];
		
		let evA = peval(a);
		let evB = peval(b);
		
		if (evA === 0 || evB === 0) {
			if (evA === 0) { roots.push(a);	}
			if (evB === 0) { roots.push(b); }
			
			return roots;
		}
		
		
		let sgn = evA / evB; 
		if (sgn < 0) {
			let root = Poly.brent(peval, a, b);
			roots.push(root);
		} 
	}
	
	return roots;	
}


/**
 * Returns <em>ordered</em> quadratic roots.
 */
function findQuadraticRoots01(q) {
	if (q.length === 0) {
		return undefined;
	}
	if (q.length === 1) {
		if (q[0] === 0) { return []; }
		return [];
	}
	if (q.length === 2) {
		if (q[0] === 0) {
			if (q[1] === 0) { return []; } 
			return []; 
		}
		let root = -q[1]/q[0];
		if (root >= 0 && root <= 1) {
			return [root];	
		}
		return [];
	}
	if (q.length > 3) {
		// TODO Can we safely throw and stay optimized?
		return undefined; 
	}
	
	let [a,b,c] = q;
	
	let root1;
	let root2;
	let delta = b*b - 4*a*c;
	if (delta < 0) {
		// No real roots;
		return []; 
	} 
	if (delta === 0) {
		root1 = -b / (2*a);
		if (root1 >= 0 && root1 <= 1) {
			return [root1];
		} else {
			return [];
		}
	}
	delta = Math.sqrt(delta);
	if (b >= 0) {
		root1 = (-b - delta) / (2*a);
		root2 = (2*c) / (-b - delta);
	} else {
		root1 = (2*c) / (-b + delta);
		root2 = (-b + delta) / (2*a);
	}
	
	let root1InRange = (root1 >= 0 && root1 <= 1); 
	let root2InRange = (root2 >= 0 && root2 <= 1);
	if (root1InRange) {
		if (root2InRange) {
			if (root1 < root2) { 
				return [root1, root2];	
			}
			return [root2, root1];
		}
		return [root1];
	}
	if (root2InRange) {
		return [root2];
	}
	return [];
}


/**
 * Searches the interval from the given lower limit to the given 
 * upper limit for a root (i.e., zero) of the given function with 
 * respect to its first argument using the Brent's Method 
 * root-finding algorithm.
 * 
 * See: https://en.wikipedia.org/wiki/Brent%27s_method
 *
 * @param {Function} f function for which the root is sought.
 * @param {Number} a the lower point of the interval to be searched.
 * @param {Number} b the upper point of the interval to be searched.
 * @param {Number} errorTol the desired accuracy (convergence tolerance).
 * @return An estimate for the root within accuracy.
 * 
 * NOTE: Brent's Method is optimized for general functions. A more 
 * specialzed algorithm targeted at polynomials using for example a
 * combination of the Secant and Newton methods might be much faster. 
 */
let TOLERANCE = 1e-15;
function brent(f, a, b, errorTol) {
	if (a === b) { return a; } // Root already found
	
	let fa = f(a);
	let fb = f(b);
    
    if (fa*fb >= 0) {
    	// Root is not bracketed - this is a precondition.
    	throw 'Root not bracketed'; 
    } 
    
    let c;
    if (Math.abs(fa) < Math.abs(fb)) { 
    	// Swap a,b
    	c = a;  a = b;  b = c;
    }
    
    c = a;
    
    let mflag = true;
    let i = 0;

    
    let prevError;
    while (true) {
    	i++;
    	
    	let fc = f(c);
    	let s;
    	
    	fa = f(a);
    	fb = f(b);
    	
    	if (fa !== fc && fb !== fc) {
    		// Inverse quadratic interpolation
    		let fac = fa - fc;
    		let fab = fa - fb;
    		let fbc = fb - fc;
    		
    		// The below has been multiplied out to speed up the algorithm.
    		/*s = ((a * fb * fc) / ( fab * fac)) +
    			((b * fa * fc) / (-fab * fbc)) +
    			((c * fa * fb) / ( fac * fbc));*/
    		s = ((a*fb*fbc - b*fa*fac)*fc + c*fa*fab*fb) / (fab*fac*fbc);
    	} else {
    		// Secant method
    		s = b - (fb * ((b-a)/(fb-fa)));
    	}
    	
    	let d;
    	let t1 = (3*a + b) / 4;
    	let b_c = Math.abs(b-c);
    	let s_b = Math.abs(s-b);
    	let c_d = Math.abs(c-d);
    	//let tol1 = Math.abs(b-c); 
    	//let tol2 = Math.abs(c-d);
    	
    	if (
    		(!( // s < t1 || s > b
    			(s > t1 && s < b) ||
    			(s < t1 && s > b)
    		)) || // condition 1
    		(mflag && ( 
    			(s_b >= b_c/2) || // condition 2
    			(/*tol1*/b_c < errorTol) // condition 4
    		)) || 
    		(!mflag && (
    			(s_b >= c_d/2) || // condition 3
    			(/*tol2*/c_d < errorTol) // condition 5
    		))
    	) {
    		// Bisection method
    		s = (a + b) / 2;
    		mflag = true;
    	} else {
    		mflag = false;
    	}
    	
    	let fs = f(s);
    	
    	d = c;
    	c = b;
    	
    	if (fa*fs < 0) { b = s; } else { a = s; }
    	
    	if (Math.abs(fa) < Math.abs(fb)) { 
    		// Swap a,b
    		let t3 = a;  a = b;  b = t3;
    	}
	    
    	
	    if (fb === 0) { // or fs === 0
	    	return b; // or return s!; can be used to select side!  
	    } else if (fs === 0) {
	    	return s;
	    }

	    let error = Math.abs(a - b);
	    if ((error/a + error/b) < TOLERANCE || error === 0 ||
	    	prevError <= error) {
	    	return b; // or return s!; can be used to select side!
	    }
	    prevError = error; 
	    
	    /*
	    if (error < errorTol) {
	    	return b; // or return s!; can be used to select side!
	    }*/
    }
}


module.exports = Poly;




// 1052 - 675 - 
