import { eSign, eDiff, fastExpansionSum, scaleExpansion, eMult } from "big-float-ts";
import { tangentAt0Exact, evaluate2ndDerivativeAt0Exact, toPowerBasis_3rdDerivativeExact } from "flo-bezier3";

const { sign } = Math;


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
function compareCurvaturesAtInterface(
        psI: number[][], 
        psO: number[][]) {

    // Get x' and y' for incoming curve evaluated at 0
    const [dxI, dyI] = tangentAt0Exact(psI);
    // Get x'' and y'' for incoming curve evaluated at 0
    const [ddxI, ddyI] = evaluate2ndDerivativeAt0Exact(psI);

    // Get x' and y' for outgoing curve evaluated at 0
    const [dxO, dyO] = tangentAt0Exact(psO);
    // Get x'' and y'' for outgoing curve evaluated at 0
    const [ddxO, ddyO] = evaluate2ndDerivativeAt0Exact(psO);

    // Recall the formula for the signed curvature of a parametric curve:
    // κ = x′y′′ - y′x′′ / sqrt(x′² + y′²)³
    // κ² = (x′y′′ - y′x′′)² / (x′² + y′²)³

    // This allows us to do an exact comparison of curvatures
    // Simplifying the above gives (denoting the incoming curve with a subscript
    // of 1 and the outgoing with a 2):
    //      κIncoming > κOutgoing
    // <=>  (x₁′y₁′′ - y₁′x₁′′)²(x₂′² + y₂′²)³ > (x₂′y₂′′ - y₂′x₂′′)²(x₁′² + y₁′²)³
    // <=>  a²b³ > c²d³
    // Note b³ > 0 and d³ > 0

    // We need to resort to exact floating point arithmetic at this point
    const a = eDiff(
        eMult(dxI, ddyI), 
        eMult(dyI, ddxI)
    );
    const c = eDiff(
        eMult(dxO, ddyO),
        eMult(dyO, ddxO)
    );

    const signA = eSign(a);
    const signC = eSign(c);
    if (sign(signA) !== sign(signC)) {
        // return a negative value if κI < κO
        return signA - signC;
    }

    const b = fastExpansionSum(
        eMult(dxO, dxO),
        eMult(dyO, dyO)
    );
    const d = fastExpansionSum(
        eMult(dxI, dxI),
        eMult(dyI, dyI)
    );

    const b2 = eMult(b, b);
    const b3 = eMult(b2, b);
    const d2 = eMult(d, d);
    const d3 = eMult(d2, d);

    if (signA !== 0 || signC !== 0) {
        const a2 = eMult(a, a);
        const c2 = eMult(c, c);

        const κI = eMult(a2,b3);
        const κO = eMult(c2,d3);
        const δκ = eSign(eDiff(κI, κO));

        if (δκ !== 0) {
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
    const [[dddxI], [dddyI]] = toPowerBasis_3rdDerivativeExact(psI); // max bitlength increase === max shift === 6
    const [[dddxO], [dddyO]] = toPowerBasis_3rdDerivativeExact(psO); // max bitlength increase === max shift === 6

    const e = eDiff(
        eMult(dxI, dddyI),
        eMult(dyI, dddxI)
    );

    const f = fastExpansionSum(
        eMult(dxI, ddxI),
        eMult(dyI, ddyI)
    );

    const g = eDiff(
        eMult(dxO, dddyO),
        eMult(dyO, dddxO)
    );

    const h = fastExpansionSum(
        eMult(dxO, ddxO),
        eMult(dyO, ddyO)
    );

    // (de - 3af)²b⁵ > (bg - 3ch)²d⁵
    // i²b⁵ > j²d⁵
    const i = eDiff(
        eMult(d, e),
        scaleExpansion(
            eMult(a, f),
            3
        )
    );

    const j = eDiff(
        eMult(b, g),
        scaleExpansion(
            eMult(c, h),
            3
        )
    );

    const signI = eSign(i);
    const signJ = eSign(j);
    if (signI !== signJ) {
        return signI - signJ;
    }

    if (signI === 0 && signJ === 0) {
        // Both curve extensions are identical, i.e. in the same K-family
        return 0;
    }

    const i2 = eMult(i,i);
    const b5 = eMult(b2,b3);
    const j2 = eMult(j,j);
    const d5 = eMult(d2,d3);

    const dκI = eMult(i2,b5);
    const dκO = eMult(j2,d5);

    const sgn = eSign(eDiff(dκI, dκO));

    return signI > 0 ? sgn : -sgn;

    // If the above returned value is still zero then the two curve extensions 
    // are identical, i.e. in the same K-family
}


export { compareCurvaturesAtInterface }