import { ddAddDd, ddMultDd, twoSum, twoProduct, ddDiffDd, ddDivDd, twoDiff, ddMultDouble1 } from 'double-double';

const ts = twoSum;
const tp = twoProduct;
const td = twoDiff;
const qaq = ddAddDd;
const qmq = ddMultDd;
const qdq = ddDiffDd;
const qmd = ddMultDouble1;

const { asin, acos, cos, sqrt, PI: π } = Math;


/**
 * Calculates and returns an appropriate seperation tolerance between `CpNode`s.
 * 
 * @param R radius of the circle implied by the curvature at the boundary
 * @param r radius of the MAT circle
 * @param θ angle between point...
 */
function calcSeperationTolerance2(
        R: number,
        r: number,
        δ: number) {

    const a = r + δ;
    if (a >= R) {
        return Number.POSITIVE_INFINITY;
    }

    const b = R - r;  //?
    const c = R;      //?
    
    const N = c*c - a*a - b*b;  //?
    const N_ = qdq(qdq(tp(c,c), tp(a,a)), tp(b,b));
    const D = 2*a*b;            //?
    const D_ = tp(-2*a,b);
    const Q = ddDivDd(N_,D_)[1];  //?
    const cosC = -N/D;  //?
    const C = acos(cosC);
    const CC = acos(Q);

    const θ = π - CC;  //?

    return θ;
    // return r*θ;  // approximate arc with line
}


export { calcSeperationTolerance }

function degToRad(degrees: number) {
    return degrees/360*2*Math.PI;
}
function radToDeg(rad: number) {
    return rad*360/2/Math.PI;
}


const R = 699;
const r = 698;
const δ = 1000*2**-46; //?
calcSeperationTolerance(R,r,δ);   //?
calcSeperationTolerance2(R,r,δ);  //?
calcSeperationTolerance3(R,r,δ);  //?

function calcSeperationTolerance(
        R: number,
        r: number,
        δ: number) {

    const a = r + δ;
    if (a >= R) {
        return Number.POSITIVE_INFINITY;
    }


    const R_r_ = twoDiff(R,r);  //?
    const A_  = qmd(r,R_r_);    //?
    const N_ = qdq(qdq(A_, tp(r,δ)), tp(δ,δ/2));  //?
    const D_ = qaq(A_,qmd(δ,R_r_));  //?

    const R_r = R - r; //?
    const A = r*R_r;   //?
    const N = A - r*δ - (δ*δ)/2;  //?
    const D = A + R_r*δ;      //?
    const cosC = N/D;      //?
    const Q = ddDivDd(N_,D_)[1];//?
    // const Q = N_[1]/D_[1];//?
    const C = acos(cosC);
    const CC = acos(Q)

    const θ = CC;  //?

    // return r*θ;
    return r*θ;
}


// * see https://en.wikipedia.org/wiki/Law_of_cosines, Version suited to small angles
function calcSeperationTolerance3(
        R: number,
        r: number,
        δ: number) {

    const a = r + δ;  //?
    const c = R - r;  //?
    const b = R;      //?
    
    // c² = (a - b)² + 4ab*sin²(θ/2) OR
    // (c² - (a - b)²)/4ab = sin²(θ/2)
    const cc = c*c;  //? 
    const abc = a*a + b*b - 2*a*b;  //?
    const A = cc - abc;  //?
    const B = sqrt(A/(4*a*b));  //?

    const θ = 2*asin(B);  //?

    return θ;
    // return r*θ;  // approximate arc with line
}