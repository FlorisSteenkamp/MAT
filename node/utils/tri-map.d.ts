/**
 * A 'tri-map' in the sense that it needs two ordered keys to return one
 * value.
 */
type TriMap<K, L, M, V> = Map<K, Map<L, Map<M, V>>>;
/**
 * Get a value from the tri-map.
 * @param map
 * @param k
 * @param l
 * @param m
 */
declare function get<K, L, M, V>(map: TriMap<K, L, M, V>, k: K, l: L, m: M): V | undefined;
/**
 * Set a value in the tri-map.
 * * destructively sets the value
 * @param map
 * @param k
 * @param l
 * @param v
 */
declare function set<K, L, M, V>(map: TriMap<K, L, M, V>, k: K, l: L, m: M, v: V): void;
declare const TriMapFs: {
    get: typeof get;
    set: typeof set;
};
export { TriMap, TriMapFs };
