/**
 * Returns the point `p` for the bezier curve `ps` at the parameter value `t`
 * with intermediate calculations done in double-double precision.
 *
 * @param ps
 * @param t
 */
declare function toP(ps: number[][], t: number): number[];
export { toP };
