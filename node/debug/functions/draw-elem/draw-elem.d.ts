import { IDebugElems } from '../../debug-elem-types.js';
/** @internal */
type TDrawElemFunctions = {
    [T in keyof IDebugElems]: (g: SVGGElement, elem: IDebugElems[T], classes?: string, delay?: number, scaleFactor?: number) => SVGElement[];
};
/** @internal */
declare const drawElemFunctions: TDrawElemFunctions;
export { drawElemFunctions, TDrawElemFunctions };
