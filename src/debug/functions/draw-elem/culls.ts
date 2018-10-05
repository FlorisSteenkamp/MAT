
import { Circle } from '../../../circle';


function culls(g: SVGGElement, culls: Circle[]) {	
    let $elems: SVGElement[] = [];

    for (let circle of culls) {
        let p = circle.center;

        $elems.push(drawCircle(g, p, 0.4, 'cyan thin5 nofill'));
    }
    
	return $elems;
}


function drawCircle(
        g: SVGGElement,
        center: number[], 
        radiusPercent: number, 
        classes: string) {

    const XMLNS = 'http://www.w3.org/2000/svg';            

    let $circle = document.createElementNS(XMLNS, 'circle');
    $circle.setAttributeNS(null, "cx", center[0].toString());
    $circle.setAttributeNS(null, "cy", center[1].toString());
    $circle.setAttributeNS(null, "r", radiusPercent.toString() + '%');
    $circle.setAttributeNS(null, "class", classes); 

    g.appendChild($circle);

    return $circle;
}


export { culls }
