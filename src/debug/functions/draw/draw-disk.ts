import { XMLNS } from "./xmlns.js";


/**
 * Draws a circle
 * @param g An SVG group element wherein to draw the circle.
 * @param circle 
 * @param classes 
 * @param delay 
 */
function drawDisk(
        g: SVGGElement, 
        circle: { radius: number, center: number[] }, 
        color = 'black',
        delay?: number) {

    const c = circle.center;
    const r = circle.radius;

    const $disk = document.createElementNS(XMLNS, 'circle');
    $disk.setAttributeNS(null, "cx", c[0].toString());
    $disk.setAttributeNS(null, "cy", c[1].toString());
    $disk.setAttributeNS(null, "r", r.toString());
    $disk.setAttributeNS(null, "fill", color); 

    g.appendChild($disk);

    if (delay) { setTimeout(() => $disk.remove(), delay); }

    return [$disk];
}


export { drawDisk }
