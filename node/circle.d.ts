/**
 * Canonical circle representation.
 */
declare class Circle {
    readonly center: number[];
    readonly radius: number;
    /**
     * @param center The center.
     * @param radius The radius.
     */
    constructor(center: number[], radius: number);
    /**
     * Returns a scaled version of the given circle without changing its center.
     * @param circle
     * @param s multiplier
     */
    static scale(circle: Circle, s: number): Circle;
    /**
     * Returns true if the first circle engulfs the second.
     * @param c1
     * @param c2
     */
    static engulfsCircle(c1: Circle, c2: Circle): boolean;
    /**
     * Returns a human-readable string description of the given circle.
     * @param circle
     */
    static toString(circle: Circle): string;
}
export { Circle };
