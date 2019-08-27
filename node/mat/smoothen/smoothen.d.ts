import { CpNode } from '../../cp-node/cp-node';
declare function getCurveToNext(cpNode: CpNode): number[][];
declare function getCurveBetween(cpNodeFrom: CpNode, cpNodeTo: CpNode): number[][];
/**
 * Smoothens the given MAT in-place by fitting consecutive mat lines with either
 * lines or quadratic or cubic beziers.
 */ export { getCurveToNext, getCurveBetween };
