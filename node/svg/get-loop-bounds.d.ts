import { Loop } from 'flo-boolean';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * @internal
 */
declare const getLoopBounds: ((loop: Loop) => {
    minX: PointOnShape;
    minY: PointOnShape;
    maxX: PointOnShape;
    maxY: PointOnShape;
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
export { getLoopBounds };
