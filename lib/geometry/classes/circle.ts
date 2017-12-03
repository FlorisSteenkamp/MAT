
import Vector from 'flo-vector2d';


class Circle {
    center: number[];
    radius: number;

    /** 
    * @param center
    * @param radius 
    */
    constructor(center: number[], radius: number) {
	    this.center = center;
        this.radius = radius;
    }


    /**
     * Returns a scaled version of the given circle without
     * changing its center position.
     * @param circle
     * @param s multiplier
     */
    public static scale(circle: Circle, s: number): Circle {
        return new Circle(circle.center, circle.radius * s)
    }


    /** 
     * Returns true if the first circle engulfs the second.
     */
    public static engulfsCircle(c1: Circle, c2: Circle): boolean {
        if (c1.radius <= c2.radius) { 
            return false; 
        }
        
        let d = Vector.squaredDistanceBetween(c1.center, c2.center);
        let dr = c1.radius - c2.radius; 
        let δ = dr*dr;

        return δ > d;
    }

    
    /**
     * Returns a human-readable string description.
     */
    public static toString(circle: Circle): string {
        return 'c: ' + circle.center + ' radius: ' + circle.radius;
    }
    
}


export default Circle;
