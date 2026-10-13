import { getBoundingBox, getBoundingBoxTight } from "flo-bezier3";
/** The (loose, axis-aligned) bounding box of a bezier curve - memoized on its control points. */
declare const getBoundingBox$: typeof getBoundingBox & {
    readonly weakMapS: WeakMap<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly mapS: Map<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly clearCache: () => void;
    readonly addToCache: (r: unknown, ...args: any) => void;
};
/** The tight (rotated) bounding box of a bezier curve - memoized on its control points. */
declare const getBoundingBoxTight$: typeof getBoundingBoxTight & {
    readonly weakMapS: WeakMap<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly mapS: Map<object, {
        readonly weakMap: WeakMap<object, any>;
        readonly map: Map<object, any>;
    }>;
    readonly clearCache: () => void;
    readonly addToCache: (r: unknown, ...args: any) => void;
};
export { getBoundingBox$, getBoundingBoxTight$ };
