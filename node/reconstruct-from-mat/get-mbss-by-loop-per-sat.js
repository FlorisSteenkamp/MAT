import { getSats2 } from "./get-sats2.js";
import { getMbssByLoopWithOppArr } from "./get-mbss-by-loop-with-opp-arr.js";
import { getCpNodessForSat } from "./get-cp-nodess-for-sat.js";
function getMbssByLoopPerSat(mats, satScale) {
    const sats = getSats2(mats, satScale);
    const cpNodessPerSat = sats.map(getCpNodessForSat);
    return cpNodessPerSat.map(getMbssByLoopWithOppArr);
}
export { getMbssByLoopPerSat };
//# sourceMappingURL=get-mbss-by-loop-per-sat.js.map