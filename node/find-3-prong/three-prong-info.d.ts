import type { CpNode } from '../cp-node/cp-node.js';
import type { Circle } from '../geometry/circle.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
interface ThreeProngInfo {
    readonly circle: Circle;
    readonly poss: PrePointOnShape[];
    readonly δ3s: CpNode[][];
}
export type { ThreeProngInfo };
