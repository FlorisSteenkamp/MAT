import { Circle } from '../../../geometry/circle.js';


/** @internal */
function culls(g: SVGGElement, culls: Circle[]) {	
    const $elems: SVGElement[] = [];

    for (const circle of culls) {
        const p = circle.center;

        $elems.push(drawCircle(g, p, 0.4, 'cyan thin5 nofill'));
    }
    
	return $elems;
}


/** @internal */
function drawCircle(
        g: SVGGElement,
        center: number[], 
        radiusPercent: number, 
        classes: string) {

    const XMLNS = 'http://www.w3.org/2000/svg';            

    const $circle = document.createElementNS(XMLNS, 'circle');
    $circle.setAttributeNS(null, "cx", center[0].toString());
    $circle.setAttributeNS(null, "cy", center[1].toString());
    $circle.setAttributeNS(null, "r", radiusPercent.toString() + '%');
    $circle.setAttributeNS(null, "class", classes); 

    g.appendChild($circle);

    return $circle;
}


export { culls }
