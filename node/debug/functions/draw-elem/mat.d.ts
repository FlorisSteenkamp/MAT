import { Mat } from '../../../mat.js';
/** @internal */
declare function drawMat(type: 'mat' | 'sat'): (g: SVGGElement, mat: Mat, classes_?: string | undefined, delay?: number, scaleFactor?: number) => SVGElement[];
export { drawMat };
