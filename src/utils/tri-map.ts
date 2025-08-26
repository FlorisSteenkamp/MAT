
/**
 * A 'tri-map' in the sense that it needs two ordered keys to return one 
 * value.
 */
type TriMap<K,L,M,V> = Map<K,Map<L,Map<M,V>>>;


/**
 * Get a value from the tri-map.
 * @param map 
 * @param k 
 * @param l 
 * @param m 
 */
function get<K,L,M,V>(
        map: TriMap<K,L,M,V>,
        k: K,
        l: L,
        m: M): V | undefined {

    const lMap = map.get(k);
    if (lMap === undefined) { return undefined; }

    const mMap = lMap.get(l);
    if (mMap === undefined) { return undefined; }

    return mMap.get(m);
}


/**
 * Set a value in the tri-map.
 * * destructively sets the value
 * @param map 
 * @param k 
 * @param l 
 * @param v 
 */
function set<K,L,M,V>(
        map: TriMap<K,L,M,V>,
        k: K,
        l: L,
        m: M,
        v: V): void {

    let lMap = map.get(k);
    if (lMap === undefined) {
        lMap = new Map();
        map.set(k, lMap);
    }

    let mMap = lMap.get(l);
    if (mMap === undefined) {
        mMap = new Map();
        lMap.set(l, mMap);
    }

    mMap.set(m, v);
}


const TriMapFs = {
    get, set
}


export { TriMap, TriMapFs }


// Test
// const triMap = new Map<number,Map<number,Map<number,number>>>();
// set(triMap, 1,2,3, 4);
// set(triMap, 4,3,2, 1);
// get(triMap, 4,2,3); //?

