/** `2 * 2^-53` -> 2x the standard round-of unit `=== Number.EPSILON` */
declare const eps: number;
/** `2^-53` -> the standard round-of unit `=== eps/2` */
declare const u: number;
/** `2^-106` -> the standard round-of unit for double-double precision `=== (eps/2)**2` */
declare const uu: number;
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
declare function γ(n: number): number;
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
declare function γγ(n: number): number;
export { γ, γγ, u, uu, eps };
