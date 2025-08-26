
/**
 * @internal
 * Represents a corner on the shape boundary, i.e. a point where two bezier
 * curves meet. Typically used internally only.
 */
interface Corner {
    /** 
     * The unit tangents at the points t === 1 of the first curve and at 
     * t === 0 of the second respectively.
     */
    tangents: number[][];
    /** The cross of the unit tangents. */
    // crossTangents: number;
    /** 
     * True if the corner is sharp, i.e. > 0 radians as one goes in a positive 
     * direction around the shape boundary.
     */
    isSharp: boolean;
    /** 
     * True if the corner is dull, i.e. < 0 radians as one goes in a positive 
     * direction around the shape boundary.
     */
    isDull: boolean;
    /** 
     * True if the corner is quite sharp, i.e. > δ radians as one goes in a 
     * positive direction around the shape boundary where δ is some 
     * pre-determined parameter.
     */
    isQuiteSharp: boolean;
    /** 
     * True if the corner is quite dull, i.e. < δ radians as one goes in a 
     * positive direction around the shape boundary where δ is some 
     * pre-determined parameter.
     */
    isQuiteDull: boolean;
}


export { Corner }
