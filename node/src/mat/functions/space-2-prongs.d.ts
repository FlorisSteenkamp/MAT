import { Vertex } from '../classes/vertex';
/**
 * Roughly evenly space 2-prongs along MAT branch (or loop).
 * TODO - FINISH!
 */
declare function space2ProngsOnBranch(mat: Vertex): {
    lines: number[][][];
    quads: number[][][];
    cubes: number[][][];
};
export { space2ProngsOnBranch };
