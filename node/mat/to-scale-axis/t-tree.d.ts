import { Circle } from '../../circle.js';
/** @hidden */
export declare type TTree = {
    trees?: Map<number, TTree>;
    circles?: Set<Circle>;
};
