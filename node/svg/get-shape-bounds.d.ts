import type { Loop } from 'flo-boolean';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
/** @internal */
declare const getShapeBounds: ((loops: Loop[]) => {
    minX: PrePointOnShape;
    minY: PrePointOnShape;
    maxX: PrePointOnShape;
    maxY: PrePointOnShape;
}) & {
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
export { getShapeBounds };
