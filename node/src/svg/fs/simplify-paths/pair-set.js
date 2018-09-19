"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pairSet_add(map, vs) {
    f(vs[0], vs[1]);
    f(vs[1], vs[0]);
    function f(v1, v2) {
        let set = map.get(v1);
        if (!set) {
            set = new Set();
            map.set(v1, set);
        }
        set.add(v2);
    }
}
exports.pairSet_add = pairSet_add;
function pairSet_has(map, vs) {
    let set;
    set = map.get(vs[0]);
    let has1 = set && set.has(vs[1]);
    set = map.get(vs[1]);
    let has2 = set && set.has(vs[0]);
    return has1 || has2;
}
exports.pairSet_has = pairSet_has;
