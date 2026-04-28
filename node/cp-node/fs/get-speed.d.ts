import { CpNode } from "../cp-node.js";
declare const getSpeed$: typeof getSpeed & {
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
declare function getSpeed(cpNode: CpNode): number | undefined;
export { getSpeed, getSpeed$ };
