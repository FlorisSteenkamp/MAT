const u = Number.EPSILON / 2;
const uu = u*u;


/**
 * The canonical floating point error function, γ.
 * 
 * * roughly `=== n * (Number.EPSILON / 2)`
 * * see e.g. [Algorithms for Accurate, Validated and Fast Polynomial Evaluation](https://hal.archives-ouvertes.fr/hal-00285603/document)
 * @param n the parameter - typically a small positive integer, e.g. for 
 * polynomial evaluation this === 2*d + 1, where d is the degree of the 
 * polynomial
 * 
 * @doc
 */
function γ(n: number): number {
    const nu = n*u;

    return nu/(1-nu);
}

/**
 * The canonical, once compensated (implying double-double precision), 
 * floating point error function.
 * 
 * * roughly `=== n * (Number.EPSILON / 2)**2`
 * * see e.g. [Algorithms for Accurate, Validated and Fast Polynomial Evaluation](https://hal.archives-ouvertes.fr/hal-00285603/document)
 * @param n the parameter - typically a small positive integer, e.g. for 
 * polynomial evaluation this === 2*d + 1, where d is the degree of the 
 * polynomial
 * 
 * @doc
 */
function γγ(n: number): number {
    const nuu = n*uu;
    
    return nuu/(1-nuu);
}


export { γ, γγ }
