import { CpNode } from '../../cp-node';
import { PointOnShape } from '../../point-on-shape';
import { Circle } from '../../circle';
declare class TwoProngForDebugging {
    pos: PointOnShape;
    δ: CpNode[];
    y: number[];
    z: number[];
    x: number[];
    circle: Circle;
    xs: {
        x: number[];
        y: PointOnShape;
        z: PointOnShape;
        t: number;
    }[];
    failed: boolean;
    holeClosing: boolean;
    notAdded: boolean;
    deleted: boolean;
    constructor(pos: PointOnShape, δ: CpNode[], y: number[], z: number[], x: number[], circle: Circle, xs: {
        x: number[];
        y: PointOnShape;
        z: PointOnShape;
        t: number;
    }[], failed: boolean, holeClosing: boolean, notAdded: boolean, deleted: boolean);
}
export { TwoProngForDebugging };
