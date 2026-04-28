import { CpNode } from "../cp-node.js";
declare function getMatDistanceToNext(cpNode: CpNode): number;
declare const getMatDistanceToNext$: typeof getMatDistanceToNext & {
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
export { getMatDistanceToNext, getMatDistanceToNext$ };
