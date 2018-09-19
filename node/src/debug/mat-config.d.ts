import { IMatConfigDraw } from './mat-config-draw';
export interface IMatConfig {
    beziersToDraw: number[];
    toDraw: IMatConfigDraw;
    svgUrl: string;
    satScale: number;
}
