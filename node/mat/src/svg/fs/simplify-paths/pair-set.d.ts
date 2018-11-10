/**
 * Adds an unordered pair of values to the set (given as a special map)
 * @param map The map representing the pairs.
 * @param vs The pair to add.
 */
declare function pairSet_add<T>(map: Map<T, Set<T>>, vs: T[]): void;
/**
 * Returns true if the unordered pair is in the set of pairs (represented by a
 * map).
 * @param map The map representing the pairs.
 * @param vs The pair to check.
 */
declare function pairSet_has<T>(map: Map<T, Set<T>>, vs: T[]): boolean;
/**
 * Returns the unordered pairs as an array.
 * @param map The map representing the pairs.
 */
declare function pairSet_asArray<T>(map: Map<T, Set<T>>): T[][];
export { pairSet_add, pairSet_has, pairSet_asArray };
