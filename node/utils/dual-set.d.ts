/**
 * A 'dual-set' in the sense that it needs two ordered keys.
 */
type DualSet<K, L> = Map<K, Set<L>>;
/**
 * Get a value from the dual-set.
 * @param set
 * @param k
 */
declare function has<K, L>(set: DualSet<K, L>, k: K, l: L): boolean;
/**
 * Adds a value to the dual-set.
 *
 * * destructively sets the value
 *
 * @param set
 * @param k
 * @param l
 */
declare function add<K, L>(set: DualSet<K, L>, k: K, l: L): void;
declare function remove<K, L>(set: DualSet<K, L>, k: K, l: L): boolean;
declare const DualSetFs: {
    has: typeof has;
    add: typeof add;
    remove: typeof remove;
};
export { DualSet, DualSetFs };
