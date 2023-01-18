import { eSign, twoProduct, eDiff, expansionProduct, fastExpansionSum, scaleExpansion } from "big-float-ts";
import { tangentAt0, evaluate2ndDerivativeAt0, toPowerBasis_3rdDerivative } from "flo-bezier3";
/**
 * Compare the curvature, κ, between two curves at t === 0.
 *
 * Returns a positive number if κ for psI > κ for psO, negative if κ for psI < κ
 * for psO or zero if the curve extensions are identical (i.e. in same K-family).
 *
 * Precondition: The point psI evaluated at zero must === the point psO
 * evaluated at zero.
 *
 * // TODO - is this correct?
 * Exact: Returns the exact result if the bithlength of all
 * coordinates <= 53 - 5 === 48 and are bit-aligned.
 *
 * @param psI An order 1, 2 or 3 bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * representing the incoming curve
 * @param psO Another bezier representing the outgoing curve
 */
function compareCurvaturesAtInterface(psI, psO) {
    // Get x' and y' for incoming curve evaluated at 0
    const [dxI, dyI] = tangentAt0(psI); // max bitlength increase / max shift === 3
    // Get x'' and y'' for incoming curve evaluated at 0
    const [ddxI, ddyI] = evaluate2ndDerivativeAt0(psI); // max bitlength increase / max shift === 5
    // Get x' and y' for outgoing curve evaluated at 0
    const [dxO, dyO] = tangentAt0(psO); // max bitlength increase / max shift === 3
    // Get x'' and y'' for outgoing curve evaluated at 0
    const [ddxO, ddyO] = evaluate2ndDerivativeAt0(psO); // max bitlength increase / max shift === 5
    //console.log('κI: ', κ(psI, 0));
    //console.log('κO: ', κ(psO, 0));
    // Remember the formula for the signed curvature of a parametric curve:
    // κ = x′y′′ - y′x′′ / sqrt(x′² + y′²)³
    // κ² = (x′y′′ - y′x′′)² / (x′² + y′²)³
    // This allows us to do an exact comparison of curvatures
    // Simplifying the above gives (denoting the incoming curve with a subscript
    // of 1 and the outgoing with a 2):
    //      κIncoming > κOutgoing
    // <=>  (x₁′y₁′′ - y₁′x₁′′)²(x₂′² + y₂′²)³ > (x₂′y₂′′ - y₂′x₂′′)²(x₁′² + y₁′²)³
    // <=>  a²b³ > c²d³
    // Note b³ > 0 and d³ > 0
    // max aggregate bitlength increase (let original bitlength === p):
    // a -> 2 x ((p+3)+(p+5) + 1) === 4p + 18 -> max p in double precision === 8 -> too low
    //let a = (dxI*ddyI - dyI*ddxI)**2;
    // b -> 3 x ((p+3) + 1) === 3p + 12
    //let b = (dxO*dxO  + dyO*dyO )**3;
    // c -> 2 x ((p+3)+(p+5) + 1) === 4p + 18
    //let c = (dxO*ddyO - dyO*ddxO)**2;
    // d -> 3 x ((p+3) + 1) === 3p + 12
    //let d = (dxI*dxI  + dyI*dyI )**3;
    // We need to resort to exact floating point arithmetic at this point
    const a = eDiff(twoProduct(dxI, ddyI), twoProduct(dyI, ddxI));
    const c = eDiff(twoProduct(dxO, ddyO), twoProduct(dyO, ddxO));
    const signA = eSign(a);
    const signC = eSign(c);
    if (signA !== signC) {
        //console.log('branch 3');
        return signA - signC;
    }
    const b = fastExpansionSum(twoProduct(dxO, dxO), twoProduct(dyO, dyO));
    const d = fastExpansionSum(twoProduct(dxI, dxI), twoProduct(dyI, dyI));
    const b2 = expansionProduct(b, b);
    const b3 = expansionProduct(b2, b);
    const d2 = expansionProduct(d, d);
    const d3 = expansionProduct(d2, d);
    if (signA !== 0 || signC !== 0) {
        //console.log('branch 4');
        const a2 = expansionProduct(a, a);
        const c2 = expansionProduct(c, c);
        // max aggregate bitlength increase (let original bitlength === p):
        // κ -> (2 x ((p+3)+(p+5) + 1)) + (3 x ((p+3) + 1)) === 7p + 30
        // e.g. for bit-aligned input bitlength p of 10 we get output bitlength 
        // of 100, or for p === 3 (the max exact bitlength allowed to have exact
        // results without resorting to infinite precision) we get 51 bits.
        const κI = expansionProduct(a2, b3);
        const κO = expansionProduct(c2, d3);
        const δκ = eSign(eDiff(κI, κO));
        if (δκ !== 0) {
            //console.log('branch 5');
            // At this point signA === signC, both +tive or -tive
            return signA > 0 ? δκ : -δκ;
        }
    }
    // At this point signA === signC, both +tive or -tive or 0
    // Now we have to look at the change of curvature w.r.t. the parameter t,
    // i.e. 
    // κ′ = [(x′²+y′²)(x′y′′′-y′x′′′) - 3(x′y′′-y′x′′)(x′x′′+y′y′′)] / (x′²+y′²)^(5/2)
    // Therefore: (denoting the incoming curve with a subscript of 1 and the outgoing with a 2)
    // κ′Incoming > κ′Outgoing
    // <=> [(x₁′²+y₁′²)(x₁′y₁′′′-y₁′x₁′′′) - 3(x₁′y₁′′-y₁′x₁′′)(x₁′x₁′′+y₁′y₁′′)]²(x₂′²+y₂′²)⁵ >
    //     [(x₂′²+y₂′²)(x₂′y₂′′′-y₂′x₂′′′) - 3(x₂′y₂′′-y₂′x₂′′)(x₂′x₂′′+y₂′y₂′′)]²(x₁′²+y₁′²)⁵
    // <=> (de - 3af)²b⁵ > (bg - 3ch)²d⁵
    // <=> i²b⁵ > j²d⁵
    // Get x′′′ and y′′′ for incoming curve evaluated at 1
    const [dddxI, dddyI] = toPowerBasis_3rdDerivative(psI); // max bitlength increase === max shift === 6
    const [dddxO, dddyO] = toPowerBasis_3rdDerivative(psO); // max bitlength increase === max shift === 6
    const e = eDiff(twoProduct(dxI, dddyI), twoProduct(dyI, dddxI));
    const f = fastExpansionSum(twoProduct(dxI, ddxI), twoProduct(dyI, ddyI));
    const g = eDiff(twoProduct(dxO, dddyO), twoProduct(dyO, dddxO));
    const h = fastExpansionSum(twoProduct(dxO, ddxO), twoProduct(dyO, ddyO));
    // (de - 3af)²b⁵ > (bg - 3ch)²d⁵
    // i²b⁵ > j²d⁵
    const i = eDiff(expansionProduct(d, e), scaleExpansion(expansionProduct(a, f), 3));
    const j = eDiff(expansionProduct(b, g), scaleExpansion(expansionProduct(c, h), 3));
    const signI = eSign(i);
    const signJ = eSign(j);
    if (signA !== signC) {
        return signI - signJ;
    }
    if (signI === 0 && signJ === 0) {
        // Both curve extensions are identical, i.e. in the same K-family
        return 0;
    }
    const i2 = expansionProduct(i, i);
    const b5 = expansionProduct(b2, b3);
    const j2 = expansionProduct(j, j);
    const d5 = expansionProduct(d2, d3);
    const dκI = expansionProduct(i2, b5);
    const dκO = expansionProduct(j2, d5);
    const sgn = eSign(eDiff(dκI, dκO));
    return signI > 0 ? sgn : -sgn;
    // If the above returned value is still zero then the two curve extensions 
    // are identical, i.e. in the same K-family
}
export { compareCurvaturesAtInterface };
//# sourceMappingURL=compare-curvatures-at-interface.js.map