
function toJsogDepthFirst(v: any) {
    const seen = new Map();
    let nextId = 1;

    function encode(obj: any): any {
      if (obj === null || typeof obj !== 'object') return obj;

      if (seen.has(obj)) {
        return { '@ref': seen.get(obj) };
      }

      // Arrays are encoded by value only because JSON drops custom array props
      // like "@id" during stringify.
      if (Array.isArray(obj)) {
        return obj.map(encode);
      }

      const id = String(nextId++);
      seen.set(obj, id);

      if (obj instanceof Map) {
        return {
          '@id': id,
          '@type': 'Map',
          entries: [...obj.entries()].map(([k, v]) => [encode(k), encode(v)])
        };
      }

      if (obj instanceof Set) {
        return {
          '@id': id,
          '@type': 'Set',
          values: [...obj.values()].map(value => encode(value))
        };
      }

      const result: Record<string, any> = { '@id': id };
      for (const [key, value] of Object.entries(obj)) {
        result[key] = encode(value);
      }
      return result;
    }

    const encoded = encode(v);

    // `copy` below is only available in the Chrome console.
    // If you want to run this in Node.js, replace it with `console.log`.
    // copy(JSON.stringify(encoded, null, 2));
    console.log(JSON.stringify(encoded, null, 2));
    // console.log('JSOG copied to clipboard.');
}


export { toJsogDepthFirst }
