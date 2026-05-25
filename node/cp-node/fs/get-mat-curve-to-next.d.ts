import { CpNode } from '../cp-node.js';
/**
 * Returns the bezier curve from the maximal disk of the given `CpNode` to the
 * next `CpNode`'s maximal disk and thus directly represents a piece of the
 * medial axis.
 * @param cpNode
 */
declare function getMatCurveToNext(cpNode: CpNode): number[][];
declare const getMatCurveToNext$: typeof getMatCurveToNext & {
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
export { getMatCurveToNext, getMatCurveToNext$ };
