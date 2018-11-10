/**
 * Memoize the given arity 1 function.
 */
declare function memoize<T extends Object, U>(f: (a: T) => U): (a: T) => U;
export { memoize };
