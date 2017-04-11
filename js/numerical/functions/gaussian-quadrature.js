'use strict'


/** 
 * The Gaussian Quadrature method to integrate the given
 * function. The integral limits are between 0 and 1.
 * 
 * @param {Number} order Can be 2, 4 or 8. 
 *        Higher values are more accurate. 
 *        
 * See https://en.wikipedia.org/wiki/Gaussian_quadrature
 * See http://pomax.github.io/bezierinfo/#arclength
 * 
 * Notes: 
 * 
 * - A future improvement can be to use the Gauss–Kronrod rules
 * to estimate the error and thus choose a number of constants based
 * on the error and not just thumb-suck.
 * 
 * - In future, the constants can be calculated and cached so we can
 * chooce any number of constants.
 * 
 */

function gaussQuadrature(f, interval, order_) {
	let order = order_ || 16;
	
	let constants = GAUSS_CONSTANTS[order];
	let weights   = constants.weights;
	let abscissas = constants.abscissas;
	let [a, b] = interval;

	let result = 0;
	let m1 = (b - a) / 2;
	let m2 = (b + a) / 2;
	for (let i=0; i<=order-1; i++) {
		result += weights[i] * f(m1*abscissas[i] + m2);
	}	
	
	return m1 * result;
}


//The Gaussian Legendre Quadrature method constants. 
const GAUSS_CONSTANTS = {
	2: { 
		weights: [1, 1], 
		abscissas: [-0.5773502691896257, 0.5773502691896257] 
	},
	4: { 
		weights: [0.6521451548625461, 0.6521451548625461, 
			 0.3478548451374538, 0.3478548451374538], 
		abscissas: [-0.3399810435848563, 0.3399810435848563, 
			 -0.8611363115940526, 0.8611363115940526] 
	},
	8: {
		weights: [0.3626837833783620, 0.3626837833783620, 
			 0.3137066458778873, 0.3137066458778873,
		     0.2223810344533745, 0.2223810344533745, 
		     0.1012285362903763, 0.1012285362903763],
		abscissas: [-0.1834346424956498, 0.1834346424956498, 
			 -0.5255324099163290, 0.5255324099163290,
		     -0.7966664774136267, 0.7966664774136267, 
		     -0.9602898564975363, 0.9602898564975363]
	},
	// Taken from http://keisan.casio.com/exec/system/1330940731
	16: {
		abscissas: [-0.989400934991649932596,
			 -0.944575023073232576078,
			 -0.86563120238783174388,
			 -0.7554044083550030338951,
			 -0.6178762444026437484467,
			 -0.4580167776572273863424,
			 -0.28160355077925891323,
			 -0.0950125098376374401853,
			  0.0950125098376374401853,
			  0.28160355077925891323,
		      0.4580167776572273863424,
			  0.617876244402643748447,
			  0.755404408355003033895,
			  0.8656312023878317438805,
			  0.944575023073232576078,
			  0.989400934991649932596
		],
		weights: [
			  0.0271524594117540948518,
			  0.062253523938647892863,
			  0.0951585116824927848099,
			  0.1246289712555338720525,
			  0.1495959888165767320815,
			  0.169156519395002538189,
			  0.182603415044923588867,
			  0.189450610455068496285,
			  0.1894506104550684962854,
			  0.182603415044923588867,
			  0.1691565193950025381893,
			  0.149595988816576732081,
			  0.124628971255533872053,
			  0.095158511682492784809,
			  0.062253523938647892863,
			  0.027152459411754094852
		]
	}
};


module.exports = gaussQuadrature;



















