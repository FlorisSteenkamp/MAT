# Q_V infinite loop - investigation handoff

Status: root cause found, **nothing fixed yet**. All diagnostic instrumentation
has been removed from `src/`.

## Symptom

`findMats` never returns for the `Q_V` glyph of `__tests__/specific-cases/test-svgs/achispado.svg`
**once the 1-prong pass is enabled**, i.e. once line 39 of
`src/find-mat/get-for-1-prongs-on-loop.ts` reads

```ts
.filter(pos => pos.t > 2**-20 && pos.t < 1 - 2**-20);
```

(The historical form `pos.t < 2**-20` is impossible, so the 1-prong pass added
nothing and the problem was invisible. Line 39 is correct as written above; the
bug is elsewhere.)

Reproduce (the loop is synchronous, so only a process-level time limit stops it;
use Git Bash for `timeout`):

```
timeout 120 npx jest __tests__/specific-cases      # with "Q_V" in the glyph list
```

## Where it loops

`findAndAdd3Prongs` (`src/find-3-prong/find-and-add-3-prongs.ts`, the
`do ... while (true)`), started from CpNode #90. Each iteration:

1. `traverseCp(#90)` visits the same 7-vertex face.
2. `find3Prong` finds the same 3-prong: radius 23.18, contacts at the dull
   corner at the end of curve 10, the dull corner at the end of curve 14, and
   curve 14 at t = 0.726.
3. `findAndAdd3Prong`'s close-by check (`getCloseByCpIfExist`) *does* find the
   copy inserted in the previous iteration, but `if (prongCount <= 2 && ...)`
   ignores anything that is already a 3-prong, so a duplicate is inserted.
4. The face does not shrink (the new nodes interleave with existing ones at the
   two corners) - repeat forever.

## Why the face is wrong

`traverseCp` from #90 returns to its own vertex through the *other* node #91 and
continues, so vertex {#90, #91} appears twice on one face. That 2-prong is
geometrically invalid: center [567.20, 736.36], radius 14.99; its contacts
(curve 13 at t = 0.9999926 and the far dull corner of curve 14, t = 1)
interleave along the boundary with those of the existing 3-prong A
(curve 13 at 0.58, curve 14 at 0.7265), and A's contact point on curve 14
([559.44, 748.45]) is 14.37 from the disk's center - inside the disk. The disk
cuts through curve 14.

## Root cause: a degenerate bezier end in the font data

Curve 13 (raw path bezier 21) is a tiny cubic whose last two control points are
identical in the SVG itself:

```
[[551.49,738.38],[552.36,738.88],[552.7243186433545,740.2428659207691],[552.7243186433545,740.2428659207691]]
```

Its speed is therefore 0 at t = 1 (|tangent| ~ 2e-10). Three things break:

1. **Spurious curvature maximum.** `getCurvatureExtremaDd` reports a maximum at
   t = 0.9999925600310483 - the curvature blowing up toward the zero-speed end
   (2.6e3 there, -4e19 at t = 1), not a feature of the shape. It passes the
   line-39 filter: 7e-6 in parameter from the end, ~1e-10 in distance. The
   candidate *is* the c13/c14 junction.
2. **Garbage normal.** `ddNormal` at that t is a vector of length 6e-5 whose
   direction is ~11 degrees off the true inward direction at the junction. The
   2-prong ray search runs along it (curve 14 *was* fully in the searched
   pieces), finds no interior tangency on that ray, and accepts the far corner
   of curve 14 at distance 14.99. `getOsculatingCircle` clamps rO to the maximum
   (1346.7) because the curvature sign is wrong there.
3. **Corner not detected.** The c13/c14 junction is a real corner of ~8 degrees,
   but `getInterfaceCcw(c13.ps, c14.ps)` takes curve 13's end tangent from the
   3e-11-long derivative; the unit tangent comes out as (0.447, 0.894) - a 1:2
   rounding residue - giving a 3.5 degree turn, under the 4 degree `DEGREE_LIMIT`.
   Result: `isDull = true`, `isQuiteDull = false`, so the corner gets no corner
   handling and no corner contact points at all.

So the spurious contact sits exactly at a corner position but is ordered as an
interior point of curve 13 (order 0), outside all corner-ordering logic, while
the corner itself is never registered - hence the "ordering" smell.

## Suggested fixes (not implemented)

Most fundamental first:

- Handle near-zero end derivatives: in `getInterfaceCcw` take the end tangent
  from the last *distinct* control point when control points coincide; reject
  curvature-extrema 1-prong candidates where the speed is below a scaled
  threshold (or where the osculating radius comes back clamped to the maximum).
- Make `findAndAdd3Prong` treat an existing 3-prong at the same contact points
  as a duplicate (drop or rethink the `prongCount <= 2` filter) so a repeat is
  detected instead of re-inserted.
- Put an iteration cap on the `do ... while (true)` in `findAndAdd3Prongs` that
  throws with context, so this class of bug fails loudly.
- Consider making `traverseCp` terminate on reaching the start *vertex* (any
  node on the start circle), not the start *node*, which would have exposed the
  inconsistency immediately.

## Useful diagnostics (how it was found, for re-use)

- `node --prof node_modules/jest/bin/jest.js --runInBand <spec>` under
  `timeout`, then `node --prof-process isolate-*.log`: the V8 log is appended
  while running, so it survives the kill and shows the hot functions.
- A per-call iteration counter in `findAndAdd3Prongs` that logs `traverseCp`'s
  visited nodes (id, curve idx, t, order, radius, ring members, prev/next) once
  a call exceeds ~3 iterations, plus logging of `getCloseByCpIfExist` results
  and `insertCpNode` pred/succ in `addToCpTree`, found the duplicate cycle.
- Logging `nnorm`, `rO`, the searched curve pieces and the antipodes in
  `find2Prong` for the source at curve 13, t > 0.9999 exposed the bad ray.

## Working-tree state to be aware of

- Line 39 of `get-for-1-prongs-on-loop.ts` is currently back in the impossible
  `pos.t < 2**-20` form (1-prong pass disabled again).
- `__tests__/specific-cases/specific-cases.spec.ts` currently lists only `"Q_V"`;
  the full glyph list from HEAD must be restored before committing.
