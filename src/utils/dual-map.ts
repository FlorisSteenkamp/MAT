
/**
 * A 'dual-map' in the sense that it needs two ordered keys to return one 
 * value.
 */
type DualMap<K,L,V> = Map<K,Map<L,V>>;


/**
 * Get a value from the dual-map.
 * @param map 
 * @param k 
 * @param l 
 */
function get<K,L,V>(
        map: DualMap<K,L,V>,
        k: K,
        l: L): V | undefined {

    let lMap = map.get(k);
    if (lMap === undefined) { return undefined; }

    return lMap.get(l);
}


/**
 * Set a value in the dual-map.
 * * destructively sets the value
 * @param map 
 * @param k 
 * @param l 
 * @param v 
 */
function set<K,L,V>(
        map: DualMap<K,L,V>,
        k: K,
        l: L,
        v: V): void {

    let lMap = map.get(k);
    if (lMap === undefined) {
        lMap = new Map();
        map.set(k, lMap);
    }
    lMap.set(l, v);
}


const DualMapFs = {
    get, set
}


export { DualMap, DualMapFs }
