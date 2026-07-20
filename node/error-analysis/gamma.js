/** `2 * 2^-53` -> 2x the standard round-of unit `=== Number.EPSILON` */
const eps = Number.EPSILON;
/** `2^-53` -> the standard round-of unit `=== eps/2` */
const u = eps / 2;
/** `2^-106` -> the standard round-of unit for double-double precision `=== (eps/2)**2` */
const uu = u * u;
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
function γ(n) {
    const nu = n * u;
    return nu / (1 - nu);
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
function γγ(n) {
    const nuu = n * uu;
    return nuu / (1 - nuu);
}
export { γ, γγ, u, uu, eps };
//# sourceMappingURL=gamma.js.map