import { Loop } from '../../../loop';
import { Curve } from '../../../curve';
import { IXInfo } from './i-x-info';
declare function getPathsIntersections(paths: Loop[]): Map<Curve, IXInfo[]>;
export { getPathsIntersections };
