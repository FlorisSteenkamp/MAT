import { IDebugElems } from '../../debug-elem-types.js';
/** @hidden */
type TDrawElemFunctions = {
    [T in keyof IDebugElems]: (g: SVGGElement, elem: IDebugElems[T], classes?: string, delay?: number) => SVGElement[];
};
/** @hidden */
declare const drawElemFunctions: TDrawElemFunctions;
export { drawElemFunctions, TDrawElemFunctions };
