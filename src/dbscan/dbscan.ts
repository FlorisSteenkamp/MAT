
/**
 * DBSCAN Clustering Algorithm
 * 
 * @param DB 
 * @param distFunc 
 * @param eps 
 * @param minPts 
 */
function DBSCAN<T>(
        DB: T[],
        distFunc: (a: T, b: T) => number,
        eps: number,
        minPts: number) {

    const labelMap = new Map<T,number>();
    let C = 0;                                                  /* Cluster counter */
    for (const P of DB) {
        if (labelMap.has(P)) { continue; }                      /* Previously processed in inner loop */

        const N = RangeQuery(DB, distFunc, P, eps);             /* Find neighbors */
        if (N.size < minPts) {                                  /* Density check */
            labelMap.set(P,-1);                                 /* Label as Noise */
            continue;
        }

        C++;                                                    /* next cluster label */
        labelMap.set(P,C);                                      /* Label initial point */
        const S: Set<T> = new Set(N); S.delete(P);              /* Neighbors to expand */
        const Ss = Array.from(S);

        for (let i=0; i<Ss.length; i++) {                       /* Process every seed point Q */
            const Q = Ss[i];
            if (labelMap.get(Q) === -1) { labelMap.set(Q,C); }  /* Change Noise to border point */
            if (labelMap.get(Q) !== undefined) { continue; }    /* Previously processed (e.g., border point) */
            labelMap.set(Q,C);                                  /* Label neighbor */
            const N = RangeQuery(DB, distFunc, Q, eps);         /* Find neighbors */
            if (N.size >= minPts) {                             /* Density check (if Q is a core point) */
                Ss.push(...N);                                  /* Add new neighbors to seed set */
            }
        }
    }

    return labelMap;
}


function RangeQuery<T>(
        DB: T[],
        distFunc: (a: T, b: T) => number,
        Q: T,
        eps: number) {

    let N = new Set<T>();
    for (const P of DB) {              /* Scan all points in the database */
        if (distFunc(Q, P) <= eps) {   /* Compute distance and check epsilon */
            N.add(P);                  /* Add to result */
        }
    }

    return N;
}


export { DBSCAN }


// function makeMore(p: number[]) {
//     const ps: number[][] = [];
//     for (let i=0; i<5; i++) {
//         const [x,y] = p;
//         ps.push([
//             x + 5*(Math.random() - 0.5),
//             y + 5*(Math.random() - 0.5),
//         ]);
//     }

//     return ps;
// }
// const ps = [
//     [10,10],[10,30],[20,50],[10,40],[70,50],[30,30]
// ]
// .flatMap(makeMore);
// function d(a: number[], b: number[]) {
//     const x = a[0] - b[0];
//     const y = a[1] - b[1];

//     return Math.sqrt(x**2 + y**2);
// }
// DBSCAN(ps, d, 5, 3);

