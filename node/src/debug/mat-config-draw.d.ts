import { ElemType_TwoProng } from "../mat/elem-type-two-prong";
export declare type IMatConfigDraw_TwoProngs = {
    [key in ElemType_TwoProng]: boolean;
};
export interface IMatConfigDraw {
    extremes: {
        all: boolean;
    };
    looseBoundingBoxes: {
        all: boolean;
    };
    tightBoundingBoxes: {
        all: boolean;
    };
    sharpCorners: {
        all: boolean;
    };
    dullCorners: {
        all: boolean;
    };
    oneProngs: {
        all: boolean;
    };
    oneProngsAtDullCorner: {
        all: boolean;
    };
    twoProngs: IMatConfigDraw_TwoProngs;
    threeProngs: {
        all: boolean;
    };
    mat: {
        all: boolean;
    };
    sat: {
        all: boolean;
    };
    smoothSats: {
        all: boolean;
    };
    boundingHulls: {
        all: boolean;
    };
}
