import { PointOnShape } from "./point-on-shape.js";
/**
 * @internal
 */
declare const isPosSharpCorner: ((pos: PointOnShape) => boolean) & {
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
export { isPosSharpCorner };
