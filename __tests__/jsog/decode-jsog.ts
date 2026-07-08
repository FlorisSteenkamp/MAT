//=======================================
// NOTE! JSOG not used in tests anymore!
//=======================================

// /**
//  * Decodes a JSOG-encoded object back into a live circular graph.
//  */
// function decodeJSOG(jsog: any) {
//     const idMap = new Map<string, any>();

//     // Pass 1: catalog all objects that have an @id.
//     function findIds(obj: any) {
//         if (!obj || typeof obj !== 'object') return;

//         if (Array.isArray(obj)) {
//             obj.forEach(findIds);
//             return;
//         }

//         if (obj['@id'] !== undefined) {
//             const id = String(obj['@id']);
//             if (!idMap.has(id)) {
//                 if (obj['@type'] === 'Map') {
//                     idMap.set(id, new Map());
//                 } else if (obj['@type'] === 'Set') {
//                     idMap.set(id, new Set());
//                 } else {
//                     idMap.set(id, {});
//                 }
//             }
//         }

//         Object.entries(obj).forEach(([key, val]) => {
//             if (key !== '@ref') {
//                 findIds(val);
//             }
//         });
//     }

//     // Pass 2: reconstruct the graph by swapping @ref for the actual object.
//     function resolve(obj: any): any {
//         if (!obj || typeof obj !== 'object') return obj;

//         if (Array.isArray(obj)) {
//             return obj.map(resolve);
//         }

//         if (obj['@ref'] !== undefined) {
//             const refId = String(obj['@ref']);
//             if (!idMap.has(refId)) {
//                 throw new Error(`Invalid JSOG: missing @id for @ref "${refId}".`);
//             }
//             return idMap.get(refId);
//         }

//         const result = obj['@id'] !== undefined
//             ? idMap.get(String(obj['@id']))
//             : {};

//         if (obj['@type'] === 'Map') {
//             for (const pair of obj.entries ?? []) {
//                 if (!Array.isArray(pair) || pair.length !== 2) continue;
//                 result.set(resolve(pair[0]), resolve(pair[1]));
//             }
//             return result;
//         }

//         if (obj['@type'] === 'Set') {
//             for (const value of obj.values ?? []) {
//                 result.add(resolve(value));
//             }
//             return result;
//         }

//         for (const key in obj) {
//             if (key === '@id' || key === '@type') continue;
//             result[key] = resolve(obj[key]);
//         }

//         return result;
//     }

//     findIds(jsog);
//     return resolve(jsog);
// }


// export { decodeJSOG }
