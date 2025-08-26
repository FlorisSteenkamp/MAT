import { Curve } from "../curve/curve.js";
import { PointOnShape } from "./point-on-shape.js";
declare function createPos(curve: Curve, t: number, isSource?: boolean): PointOnShape;
export { createPos };
