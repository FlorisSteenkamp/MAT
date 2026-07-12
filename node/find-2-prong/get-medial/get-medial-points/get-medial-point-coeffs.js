import { getMedialPointCoeffsBez2 } from './get-medial-point-coeffs-bez2';
import { getMedialPointCoeffsBez1 } from './get-medial-point-coeffs-bez1';
import { getMedialPointCoeffsBez3 } from './get-medial-point-coeffs-bez3';
const getMedialPointCoeffss = [
    ,
    ,
    getMedialPointCoeffsBez1,
    getMedialPointCoeffsBez2,
    getMedialPointCoeffsBez3
];
function getMedialPointCoeffs(p, v, ps) {
    return getMedialPointCoeffss[ps.length](p, v, ps);
}
export { getMedialPointCoeffs };
//# sourceMappingURL=get-medial-point-coeffs.js.map