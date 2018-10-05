
/**
 * Adds an unordered pair of values to the set (given as a special map)
 * @param map The map representing the pairs.
 * @param vs The pair to add.
 */
function pairSet_add<T>(
        map: Map<T,Set<T>>, 
        vs: T[]) {

    if (pairSet_has(map, vs)) {
        return;
    }

    f(vs[0], vs[1]);
    f(vs[1], vs[0]);

    function f(v1: T, v2: T) {
        let set = map.get(v1);
        if (!set) { 
            set = new Set<T>();
            map.set(v1, set);
        }  
        set.add(v2);
    }
}


/**
 * Returns true if the unordered pair is in the set of pairs (represented by a
 * map).
 * @param map The map representing the pairs.
 * @param vs The pair to check.
 */
function pairSet_has<T>(
        map: Map<T,Set<T>>, 
        vs: T[]) {

    let set: Set<T>;

    set = map.get(vs[0]);
    let has1 = set && set.has(vs[1]); 

    set = map.get(vs[1]);
    let has2 = set && set.has(vs[0]); 

    return has1 || has2;
}


/**
 * Returns the unordered pairs as an array.
 * @param map The map representing the pairs.
 */
function pairSet_asArray<T>(map: Map<T,Set<T>>) {
    let items: T[][] = [];
    let map_ = new Map<T,Set<T>>();

    for (let m of map) {
        for (let s of m[1]) {
            let vs = [m[0], s];
            if (!pairSet_has(map_, vs)) {
                items.push(vs);
                pairSet_add(map_, vs);
            }
        }
    }

    return items;
}


export { pairSet_add, pairSet_has, pairSet_asArray }
