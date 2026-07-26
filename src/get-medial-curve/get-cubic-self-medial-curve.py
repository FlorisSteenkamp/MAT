"""
Pure symbolic setup for the cubic planar parametric self-medial problem.

This file intentionally performs no numeric calculations.
It derives polynomial equations in symbolic parameters only.

Core idea (self-contact pair on one cubic r(u) = (X(u), Y(u))):
1. Use two parameters t and s on the same cubic, and an unknown medial point m.
2. Use two separate spoke vectors:
    v_t = r(t) - m
    v_s = r(s) - m
3. Enforce orthogonality at both contacts:
    v_t . r'(t) = 0
    v_s . r'(s) = 0
4. Enforce equal spoke lengths (equal-radius condition):
    |v_t|^2 - |v_s|^2 = 0
5. Remove the trivial branch t = s.

These polynomial constraints define the nontrivial self-medial relation.
"""

from __future__ import annotations

from sympy import Matrix, Poly, expand, fraction, simplify, symbols


SymPoint = Matrix


def cubic_power_point_sym(cx, cy, u):
    """
    Return the symbolic point r(u) = (X(u), Y(u)) in power basis.

    Parameters:
    - cx: coefficients [x0, x1, x2, x3] for X(u)=x0+x1*u+x2*u^2+x3*u^3.
    - cy: coefficients [y0, y1, y2, y3] for Y(u)=y0+y1*u+y2*u^2+y3*u^3.
    - u: symbolic parameter.

    Returns:
    - A 2D SymPy column vector representing r(u).
    """
    x0, x1, x2, x3 = cx
    y0, y1, y2, y3 = cy
    xu = x0 + x1*u + x2*(u**2) + x3*(u**3)
    yu = y0 + y1*u + y2*(u**2) + y3*(u**3)
    return Matrix([xu, yu])


def cubic_power_d1_sym(cx, cy, u):
    """
    Return the symbolic first derivative r'(u) in power basis.

    Parameters:
    - cx: coefficients [x0, x1, x2, x3] of X(u).
    - cy: coefficients [y0, y1, y2, y3] of Y(u).
    - u: symbolic parameter.

    Returns:
    - A 2D SymPy column vector representing r'(u).
    """
    _, x1, x2, x3 = cx
    _, y1, y2, y3 = cy
    dx = x1 + 2*x2*u + 3*x3*(u**2)
    dy = y1 + 2*y2*u + 3*y3*(u**2)
    return Matrix([dx, dy])


def dot2(a: SymPoint, b: SymPoint):
    return a[0]*b[0] + a[1]*b[1]


def orthogonality_equations(cx, cy, t, s, m: SymPoint):
    """
    Build the two orthogonality equations for a self-contact pair.

    Equations:
    - (r(t) - m) . r'(t) = 0
    - (r(s) - m) . r'(s) = 0
    """
    rt = cubic_power_point_sym(cx, cy, t)
    rs = cubic_power_point_sym(cx, cy, s)
    d1t = cubic_power_d1_sym(cx, cy, t)
    d1s = cubic_power_d1_sym(cx, cy, s)

    vt = rt - m
    vs = rs - m

    e_ortho_t = simplify(dot2(vt, d1t))
    e_ortho_s = simplify(dot2(vs, d1s))

    return e_ortho_t, e_ortho_s


def equal_length_equation(cx, cy, t, s, m: SymPoint):
    """
    Build the equal-length spoke equation for a self-contact pair.

    Equation:
    - |r(t) - m|^2 - |r(s) - m|^2 = 0
    """
    rt = cubic_power_point_sym(cx, cy, t)
    rs = cubic_power_point_sym(cx, cy, s)

    vt = rt - m
    vs = rs - m

    return simplify(dot2(vt, vt) - dot2(vs, vs))


def self_medial_equation_system(cx, cy, t, s, m: SymPoint):
    """
    Return the core symbolic self-medial system {E_t, E_s, E_l}.

    Where:
    - E_t := (r(t) - m) . r'(t)
    - E_s := (r(s) - m) . r'(s)
    - E_l := |r(t) - m|^2 - |r(s) - m|^2
    """
    e_t, e_s = orthogonality_equations(cx, cy, t, s, m)
    e_l = equal_length_equation(cx, cy, t, s, m)
    return {
        "E_t": simplify(e_t),
        "E_s": simplify(e_s),
        "E_l": simplify(e_l),
    }


def _linear_coeffs_in_m(expr, mx, my):
    """Return coefficients (a, b, c) for a*mx + b*my + c from expr."""
    p = Poly(expr, mx, my)
    a = p.coeff_monomial(mx)
    b = p.coeff_monomial(my)
    c = p.coeff_monomial(1)
    return a, b, c


def eliminate_medial_point(system, mx, my):
    """
    First elimination step: remove mx,my from {E_t,E_s,E_l}.

    Strategy:
    - E_t and E_s are linear in mx,my.
    - Solve E_t=0 and E_s=0 symbolically for mx,my via Cramer's rule.
    - Substitute into E_l to get a reduced relation in t,s and curve coefficients.

    Returns:
    - det_m: determinant of the 2x2 linear system in (mx,my)
    - mx_expr, my_expr: symbolic solutions for mx,my
    - E_l_reduced: E_l after substitution
    """
    e_t = system["E_t"]
    e_s = system["E_s"]
    e_l = system["E_l"]

    a_t, b_t, c_t = _linear_coeffs_in_m(e_t, mx, my)
    a_s, b_s, c_s = _linear_coeffs_in_m(e_s, mx, my)

    det_m = a_t*b_s - a_s*b_t

    mx_expr = (b_t*c_s - b_s*c_t) / det_m
    my_expr = (a_s*c_t - a_t*c_s) / det_m

    e_l_reduced = e_l.subs({mx: mx_expr, my: my_expr})

    return {
        "det_m": simplify(det_m),
        "mx_expr": simplify(mx_expr),
        "my_expr": simplify(my_expr),
        "E_l_reduced": simplify(e_l_reduced),
    }


def reduced_ts_polynomial_data(elim1, t, s):
    """
    Summarize the reduced t,s relation after eliminating mx,my.

    Returns:
    - N_ts: denominator-cleared numerator of E_l_reduced
    - deg_t_N, deg_s_N: polynomial degrees of N_ts in t and s
    - generic_branch_condition: det_m != 0
    """
    n_ts, d_ts = fraction(simplify(elim1["E_l_reduced"]))
    n_ts = simplify(n_ts)

    return {
        "N_ts": n_ts,
        "D_ts": simplify(d_ts),
        "deg_t_N": poly_degree(n_ts, t),
        "deg_s_N": poly_degree(n_ts, s),
        "generic_branch_condition": simplify(elim1["det_m"]),
    }


def extract_t_minus_s_factor(n_ts, t, s):
    """
    Step 5.5: expand N(t,s) and deflate any (t-s)^k factor.

    Returns:
    - N_expanded: expanded polynomial expression
    - ts_multiplicity: largest k with (t-s)^k dividing N
    - N_deflated: N / (t-s)^k
    - deg_t_deflated, deg_s_deflated
    """
    n_expanded = expand(simplify(n_ts))

    p = Poly(n_expanded, t, s)
    ts = Poly(t - s, t, s)

    q = p
    multiplicity = 0
    while True:
        qq, rr = q.div(ts)
        if rr.is_zero:
            q = qq
            multiplicity += 1
        else:
            break

    n_deflated = simplify(q.as_expr())

    return {
        "N_expanded": n_expanded,
        "ts_multiplicity": multiplicity,
        "N_deflated": n_deflated,
        "deg_t_deflated": q.degree(t),
        "deg_s_deflated": q.degree(s),
    }


def get_degree5_ts_polynomial():
    """
    Build and return the deflated self-medial relation polynomial in (t,s).

    For the generic cubic power basis setup in this file, the returned
    polynomial is the Step-5 numerator with the trivial (t-s)^k factor removed.
    In the current symbolic setup this yields a degree-5 in t and degree-5 in s
    polynomial (generic branch).
    """
    x0, x1, x2, x3 = symbols("x0 x1 x2 x3", real=True)
    y0, y1, y2, y3 = symbols("y0 y1 y2 y3", real=True)
    t, s = symbols("t s", real=True)
    mx, my = symbols("mx my", real=True)

    cx = [x0, x1, x2, x3]
    cy = [y0, y1, y2, y3]
    m = Matrix([mx, my])

    system = self_medial_equation_system(cx, cy, t, s, m)
    elim1 = eliminate_medial_point(system, mx, my)
    reduced = reduced_ts_polynomial_data(elim1, t, s)
    ts_deflate = extract_t_minus_s_factor(reduced["N_ts"], t, s)

    return {
        "t": t,
        "s": s,
        "coeffs_x": (x0, x1, x2, x3),
        "coeffs_y": (y0, y1, y2, y3),
        "det_m": reduced["generic_branch_condition"],
        "ts_multiplicity": ts_deflate["ts_multiplicity"],
        "P5": ts_deflate["N_deflated"],
        "deg_t": ts_deflate["deg_t_deflated"],
        "deg_s": ts_deflate["deg_s_deflated"],
    }


def step7_symbolic_mapping_data():
    """
    Step 7 symbolic post-processing stub (no numerics).

    This function packages the symbolic objects needed after obtaining P5:
    1. Parameter-space relation: P5(t,s) = 0
    2. Branch constraints:
       - det_m(t,s) != 0
       - t - s != 0 (nontrivial branch)
    3. Reconstruction map from parameter pairs to medial points:
       (t,s) -> (mx(t,s), my(t,s))

    It does not solve P5 or evaluate any numeric roots.
    """
    x0, x1, x2, x3 = symbols("x0 x1 x2 x3", real=True)
    y0, y1, y2, y3 = symbols("y0 y1 y2 y3", real=True)
    t, s = symbols("t s", real=True)
    mx, my = symbols("mx my", real=True)

    cx = [x0, x1, x2, x3]
    cy = [y0, y1, y2, y3]
    m = Matrix([mx, my])

    system = self_medial_equation_system(cx, cy, t, s, m)
    elim1 = eliminate_medial_point(system, mx, my)
    reduced = reduced_ts_polynomial_data(elim1, t, s)
    ts_deflate = extract_t_minus_s_factor(reduced["N_ts"], t, s)

    return {
        "t": t,
        "s": s,
        "coeffs_x": (x0, x1, x2, x3),
        "coeffs_y": (y0, y1, y2, y3),
        "P5": ts_deflate["N_deflated"],
        "deg_t_P5": ts_deflate["deg_t_deflated"],
        "deg_s_P5": ts_deflate["deg_s_deflated"],
        "trivial_factor_multiplicity": ts_deflate["ts_multiplicity"],
        "constraint_det_nonzero": reduced["generic_branch_condition"],
        "constraint_t_minus_s_nonzero": t - s,
        "mx_of_ts": elim1["mx_expr"],
        "my_of_ts": elim1["my_expr"],
    }


def normalize_reduced_numerator(n_ts, t, s):
    """
    Remove obvious repeated factors from N(t,s).

    This keeps only the primitive square-free part in Q[coeffs][t,s].
    """
    p = Poly(simplify(n_ts), t, s)
    content, primitive = p.primitive()
    sqf = primitive.sqf_part()

    return {
        "content": simplify(content),
        "N_primitive": simplify(primitive.as_expr()),
        "N_sqf": simplify(sqf.as_expr()),
        "deg_t_sqf": sqf.degree(t),
        "deg_s_sqf": sqf.degree(s),
        "repeated_factor_removed": sqf.total_degree() < primitive.total_degree(),
    }


def poly_degree(expr, var):
    return Poly(simplify(expr), var).degree()



def _demo_symbolic(*, run_step6: bool = False) -> None:
    # Generic cubic power basis:
    # X(u)=x0+x1*u+x2*u^2+x3*u^3, Y(u)=y0+y1*u+y2*u^2+y3*u^3
    x0, x1, x2, x3 = symbols("x0 x1 x2 x3", real=True)
    y0, y1, y2, y3 = symbols("y0 y1 y2 y3", real=True)
    t, s = symbols("t s", real=True)
    mx, my = symbols("mx my", real=True)

    cx = [x0, x1, x2, x3]
    cy = [y0, y1, y2, y3]

    m = Matrix([mx, my])
    e_ortho_t, e_ortho_s = orthogonality_equations(cx, cy, t, s, m)
    e_equal = equal_length_equation(cx, cy, t, s, m)
    system = self_medial_equation_system(cx, cy, t, s, m)
    elim1 = eliminate_medial_point(system, mx, my)
    reduced = reduced_ts_polynomial_data(elim1, t, s)
    ts_deflate = extract_t_minus_s_factor(reduced["N_ts"], t, s)
    degree5 = get_degree5_ts_polynomial()
    normalized = None
    if run_step6:
        normalized = normalize_reduced_numerator(ts_deflate["N_deflated"], t, s)

    print("Step 1: Orthogonality equations")
    print("(r(t)-m) . r'(t) =", e_ortho_t)
    print("(r(s)-m) . r'(s) =", e_ortho_s)
    print()

    print("Step 2: Equal-length equation")
    print("|r(t)-m|^2 - |r(s)-m|^2 =", e_equal)
    print()

    print("Step 3: Packaged symbolic system {E_t, E_s, E_l}")
    print("E_t =", system["E_t"])
    print("E_s =", system["E_s"])
    print("E_l =", system["E_l"])
    print()

    print("Step 4: First elimination (remove mx,my)")
    print("det_m =", elim1["det_m"])
    print("mx(t,s) =", elim1["mx_expr"])
    print("my(t,s) =", elim1["my_expr"])
    print("E_l after substitution =", elim1["E_l_reduced"])
    print()

    print("Step 5: Reduced single relation data")
    print("N(t,s) (numerator after clearing denominator) =", reduced["N_ts"])
    print("deg_t N =", reduced["deg_t_N"])
    print("deg_s N =", reduced["deg_s_N"])
    print("generic branch condition: det_m != 0, where det_m =", reduced["generic_branch_condition"])
    print()

    print("Step 5.5: (t-s) deflation")
    print("(t-s) multiplicity in N =", ts_deflate["ts_multiplicity"])
    print("deg_t N_deflated =", ts_deflate["deg_t_deflated"])
    print("deg_s N_deflated =", ts_deflate["deg_s_deflated"])
    print()

    print("Final deflated polynomial for future work")
    print("P5(t,s) =", degree5["P5"])
    print()

    print("Step 7: Symbolic mapping stub")
    print("Use step7_symbolic_mapping_data() to get:")
    print("- P5(t,s)=0 in parameter space")
    print("- constraints det_m!=0 and t-s!=0")
    print("- reconstruction map (t,s)->(mx(t,s), my(t,s))")

    if run_step6:
        print("Step 6: Normalized reduced numerator")
        print("(applied to N_deflated)")
        print("content(N) =", normalized["content"])
        print("repeated factors removed =", normalized["repeated_factor_removed"])
        print("deg_t N_sqf =", normalized["deg_t_sqf"])
        print("deg_s N_sqf =", normalized["deg_s_sqf"])
    else:
        print("Step 6: Normalized reduced numerator")
        print("Skipped by default (can be expensive on fully generic coefficients).")
        print("To run it, call _demo_symbolic(run_step6=True).")

    print()


if __name__ == "__main__":
    _demo_symbolic()
