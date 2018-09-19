import { Circle } from '../../classes/circle';
export declare type TTree = {
    trees?: Map<number, TTree>;
    circles?: Set<Circle>;
};
