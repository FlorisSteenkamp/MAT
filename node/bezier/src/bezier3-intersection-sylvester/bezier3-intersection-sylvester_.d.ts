/**
 * TODO - unfinished
 * Returns the intersection points between two cubic beziers. This function is
 * not numerically stable. Use for experimentation and comparison only. The
 * algorithm may be enhanced to use exact arithmetic in degenerate cases.
 * T-value pairs at intersection of the first and second beziers respectively.
 * @param ps1 - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param ps2 - Another cubic bezier
 * See http://mat.polsl.pl/sjpam/zeszyty/z6/Silesian_J_Pure_Appl_Math_v6_i1_str_155-176.pdf
 */
declare function bezier3IntersectionSylvester(ps1: number[][], ps2: number[][]): number[][];
export { bezier3IntersectionSylvester };
