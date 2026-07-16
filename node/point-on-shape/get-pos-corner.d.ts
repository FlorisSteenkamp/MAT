import type { Corner } from "../corner/corner.js";
import type { Curve } from "flo-boolean";
/**
 * @internal
 */
declare const getPosCorner$: ((pos: {
    t: number;
    curve: Curve;
}) => Corner) & {
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
export { getPosCorner$ };
