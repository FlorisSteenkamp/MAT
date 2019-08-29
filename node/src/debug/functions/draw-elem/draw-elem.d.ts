import { IDebugElems } from '../../debug-elem-types';
/** @hidden */
declare type TDrawElemFunctions = {
    [T in keyof IDebugElems]: (g: SVGGElement, elem: IDebugElems[T]) => SVGElement[];
};
/** @hidden */
declare let drawElemFunctions: TDrawElemFunctions;
export { drawElemFunctions, TDrawElemFunctions };
