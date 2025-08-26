import { DebugElem, DebugElemKey } from '../../debug-elem-types.js';
type DrawElemFunction<T extends DebugElemKey> = (g: SVGGElement, elem: DebugElem[T], classes?: string, delay?: number, scaleFactor?: number, options?: any) => SVGElement[];
/** @internal */
type DrawElemFunctions = {
    [T in DebugElemKey]: DrawElemFunction<T>;
};
/** @internal */
declare const drawElemFs: DrawElemFunctions;
declare const drawElemFsDetailed: DrawElemFunctions;
export { drawElemFs, drawElemFsDetailed, DrawElemFunctions };
