import type { Curve } from "flo-boolean";
import type { PointOnShape } from "./point-on-shape.js";
declare function createPos(curve: Curve, t: number, isSource?: boolean): PointOnShape;
export { createPos };
