/**
 * Memoize (by reference on the input parameter) the given arity 1 function.
 *
 * * also works with primitive keys
 * * keys will *never* be garbage collected (even if they're not
 * primitive); this may or may not be ok, depending on the use case
 * * will also work with `object`s but since this will hold a reference and
 * prevent garbage collection, rather use `memoize` instead
 */
declare function memoizePrimitive<T, U>(f: (a: T) => U): (a: T) => U;
export { memoizePrimitive };
