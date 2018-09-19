
function pairSet_add<T>(
        map: Map<T,Set<T>>, 
        vs: T[]) {

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


export { pairSet_add, pairSet_has }
