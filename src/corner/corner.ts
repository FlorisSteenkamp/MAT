
/**
 * Represents a corner on the shape boundary, i.e. a point where two bezier
 * curves meet. Typically used internally only.
 * 
 * @internal
 */
interface Corner {
    /** 
     * The unit tangents at the points t === 1 of the first curve and at 
     * t === 0 of the second respectively.
     */
    readonly tangents: number[][];
    /** The cross of the unit tangents. */
    // crossTangents: number;
    /** 
     * True if the corner is sharp, i.e. > 0 radians as one goes in a positive 
     * direction around the shape boundary.
     */
    readonly isSharp: boolean;
    /** 
     * True if the corner is dull, i.e. < 0 radians as one goes in a positive 
     * direction around the shape boundary.
     */
    readonly isDull: boolean;
    /** 
     * True if the corner is quite sharp, i.e. > δ radians as one goes in a 
     * positive direction around the shape boundary where δ is some 
     * pre-determined parameter.
     */
    readonly isQuiteSharp: boolean;
    /** 
     * True if the corner is quite dull, i.e. < δ radians as one goes in a 
     * positive direction around the shape boundary where δ is some 
     * pre-determined parameter.
     */
    readonly isQuiteDull: boolean;
}


export { Corner }
