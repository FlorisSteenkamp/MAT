import { /*DebugElemType,*/ IDebugElems } from '../../debug-elem-types';
declare type TDrawElemFunctions = {
    [T in keyof IDebugElems]: (g: SVGGElement, elem: IDebugElems[T]) => SVGElement[];
};
declare let drawElemFunctions: TDrawElemFunctions;
export { drawElemFunctions, TDrawElemFunctions };
