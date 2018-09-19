import { MatCircle } from '../../classes/mat-circle';
export declare type TTree = {
    [index: number]: TTree;
} | Map<string, MatCircle>;
