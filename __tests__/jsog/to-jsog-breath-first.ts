//=======================================
// NOTE! JSOG not used in tests anymore!
//=======================================

// /*
// Copy/paste this into the Chrome console to serialize an object to JSOG
// and copy the result to clipboard. Replace `temp1` with your root object.
// */
// // (() => {
// //     const encoded = toJsogBreathFirst(temp1);
// //     copy(JSON.stringify(encoded, null, 2));
// // })();


// function toJsogBreathFirst(v: any) {
//     const seen = new Map();
//     let nextId = 1;

//     type QueueItem =
//         | { kind: 'array'; source: any[]; target: any[] }
//         | { kind: 'map'; source: Map<any, any>; target: { '@id': string; '@type': 'Map'; entries: any[] } }
//         | { kind: 'set'; source: Set<any>; target: { '@id': string; '@type': 'Set'; values: any[] } }
//         | { kind: 'object'; source: Record<string, any>; target: Record<string, any> };

//     const queue: QueueItem[] = [];

//     function encodeValue(value: any): any {
//         if (value === null || typeof value !== 'object') return value;

//         if (seen.has(value)) {
//             return { '@ref': seen.get(value) };
//         }

//         // Arrays are encoded by value only because JSON drops custom array props
//         // like "@id" during stringify.
//         if (Array.isArray(value)) {
//             const result: any[] = new Array(value.length);
//             queue.push({ kind: 'array', source: value, target: result });
//             return result;
//         }

//         const id = String(nextId++);
//         seen.set(value, id);

//         if (value instanceof Map) {
//             const result = {
//                 '@id': id,
//                 '@type': 'Map' as const,
//                 entries: [] as any[]
//             };
//             queue.push({ kind: 'map', source: value, target: result });
//             return result;
//         }

//         if (value instanceof Set) {
//             const result = {
//                 '@id': id,
//                 '@type': 'Set' as const,
//                 values: [] as any[]
//             };
//             queue.push({ kind: 'set', source: value, target: result });
//             return result;
//         }

//         const result: Record<string, any> = { '@id': id };
//         queue.push({ kind: 'object', source: value, target: result });
//         return result;
//     }

//     const encoded = encodeValue(v);

//     while (queue.length > 0) {
//         const item = queue.shift()!;

//         if (item.kind === 'array') {
//             for (let i = 0; i < item.source.length; i++) {
//                 item.target[i] = encodeValue(item.source[i]);
//             }
//             continue;
//         }

//         if (item.kind === 'map') {
//             for (const [k, val] of item.source.entries()) {
//                 item.target.entries.push([encodeValue(k), encodeValue(val)]);
//             }
//             continue;
//         }

//         if (item.kind === 'set') {
//         for (const val of item.source.values()) {
//             item.target.values.push(encodeValue(val));
//         }
//         continue;
//         }

//         for (const [key, val] of Object.entries(item.source)) {
//             item.target[key] = encodeValue(val);
//         }
//     }

//     // `copy` below is only available in the Chrome console.
//     // If you want to run this in Node.js, replace it with `console.log`.
//     // copy(JSON.stringify(encoded, null, 2));
//     // console.log(JSON.stringify(encoded, null, 2));
//     // console.log('JSOG copied to clipboard.');
//     return encoded;
// }


// export { toJsogBreathFirst }
