declare class Circle {
    readonly center: number[];
    readonly radius: number;
    /**
    * @param center
    * @param radius
    */
    constructor(center: number[], radius: number);
    /**
     * Returns a scaled version of the given circle without
     * changing its center position.
     * @param circle
     * @param s multiplier
     */
    static scale(circle: Circle, s: number): Circle;
    /**
     * Returns true if the first circle engulfs the second.
     */
    static engulfsCircle(c1: Circle, c2: Circle): boolean;
    /**
     * Returns a human-readable string description.
     */
    static toString(circle: Circle): string;
}
export { Circle };
