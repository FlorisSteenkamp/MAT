
// interface ArraySet<T> {
//     idxMap: Map<T,number>;
//     arr: T[];
// }


// function add<T>(
//         arraySet: ArraySet<T>,
//         t: T) {

//     const { arr, idxMap } = arraySet;
//     arr.push(t);
//     idxMap.set(t, arr.length-1);
// }


// function addAll<T>(
//         arraySet: ArraySet<T>,
//         ts: T[]) {

//     for (const t of ts) {
//         add(arraySet, t);
//     }
// }


// function remove<T>(
//         arraySet: ArraySet<T>,
//         t: T) {

//     const { arr, idxMap } = arraySet;
//     const idx = idxMap.get(t);
//     if (idx === undefined) {
//         return false;
//     }


// }


// const ArraySetFs = {
//     add, addAll, remove
// }


// export { ArraySetFs }
