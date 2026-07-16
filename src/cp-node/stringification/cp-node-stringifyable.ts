import type { Circle } from "../../geometry/circle";
import type { PointOnShape } from "../../point-on-shape/point-on-shape";
import type { CpNode } from "../cp-node";
import type { LoopStringifyable } from "./loop-stringifyable";


/** @internal */
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
/** @internal */
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>


/** @internal */
type Edge =
    | 'prev' | 'next'
    | 'prevOnCircle' | 'nextOnCircle'
    | 'holeCloserTwin';


/** @internal */
type PointOnShapeSimplified = Omit<PointOnShape, 'curve'> & {
    readonly loopIdx: number;
    readonly curveIdx: number;
}

/** @internal */
type CpNodeSimplified = Omit<CpNode, 'pointOnShape'> & {
    readonly pointOnShape: PointOnShapeSimplified;
}

/** @internal */
type CpNodeSimplifiedEdgeless = Omit<CpNodeSimplified, Edge>;

/** @internal */
type CpNodeWithAnyEdges = PartialBy<
    CpNodeSimplifiedEdgeless & Record<Edge, CpNode | number>,
    'holeCloserTwin'
>


interface CpNodeStringifyable {
    readonly cpNodes: CpNodeWithAnyEdges[];
    readonly loops: LoopStringifyable[];
}


const EDGES: Edge[] = [
    'prev', 'next',
    'prevOnCircle', 'nextOnCircle',
    'holeCloserTwin'
];


export { EDGES }
export type {
    PointOnShapeSimplified,
    CpNodeSimplified, CpNodeSimplifiedEdgeless,
    CpNodeStringifyable, CpNodeWithAnyEdges,
}
