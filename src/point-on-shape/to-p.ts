import { evalDeCasteljauDd } from "flo-bezier3";


/**
 * Returns the point `p` for the bezier curve `ps` at the parameter value `t`
 * with intermediate calculations done in double-double precision.
 * 
 * @param ps 
 * @param t 
 */
function toP(
        ps: number[][],
        t: number): number[] {

    return evalDeCasteljauDd(ps, [0,t]).map(c => c[0] + c[1]);
}


export { toP }
