import { Circle } from '../../circle';
/** @hidden */
export declare type TTree = {
    trees?: Map<number, TTree>;
    circles?: Set<Circle>;
};
