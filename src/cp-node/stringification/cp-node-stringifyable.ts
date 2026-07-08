// import type { Loop } from "flo-boolean";
import type { Circle } from "../../geometry/circle";
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
type PointOnShapeSimplified = {
    readonly loopIdx: number;
    readonly curveIdx: number;
    readonly p: number[];
    readonly t: number;
    readonly isSource?: boolean;
}
/** @internal */
type ContactPointSimplified = {
    readonly circle: Circle;
    readonly pointOnShape: PointOnShapeSimplified;
    readonly order: number;
    readonly order2: number;
}
/** @internal */
type CpNodeSimplified = Omit<CpNode, 'cp'> & {
    readonly cp: ContactPointSimplified;
}

/** @internal */
type CpNodeSimplifiedEdgeless = Omit<CpNodeSimplified, Edge>;

/** @internal */
type CpNodeWithAnyEdges = PartialBy<
    CpNodeSimplifiedEdgeless & Record<Edge, CpNode | number>,
    'holeCloserTwin'
>


interface CpNodeStringifyable {
    cpNodes: CpNodeWithAnyEdges[];
    loops: LoopStringifyable[];
}


const EDGES: Edge[] = [
    'prev', 'next',
    'prevOnCircle', 'nextOnCircle',
    'holeCloserTwin'
];


export { EDGES }
export type {
    PointOnShapeSimplified, ContactPointSimplified,
    CpNodeSimplified, CpNodeSimplifiedEdgeless,
    CpNodeStringifyable, CpNodeWithAnyEdges,
}
