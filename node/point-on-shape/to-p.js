import { evalDeCasteljauDd } from "flo-bezier3";
/**
 * Returns the point `p` for the bezier curve `ps` at the parameter value `t`
 * with intermediate calculations done in double-double precision.
 *
 * @param ps
 * @param t
 */
function toP(ps, t) {
    return evalDeCasteljauDd(ps, [0, t]);
}
export { toP };
//# sourceMappingURL=to-p.js.map