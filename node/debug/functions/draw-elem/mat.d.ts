import { Mat } from '../../../mat/mat.js';
/** @internal */
declare function drawMat(type: 'mat' | 'sat'): (g: SVGGElement, mat: Mat, classes_?: string, delay?: number, scaleFactor?: number) => SVGElement[];
export { drawMat };
