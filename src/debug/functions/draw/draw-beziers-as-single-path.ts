import { XMLNS } from "./xmlns.js";


function drawBeziersAsSinglePath(
        g: SVGGElement,
        beziers: number[][][],
        class_ = 'thin10 red nofill',
        delay = 0) {

    if (beziers.length === 0) { return []; }

    const x0 = beziers[0][0][0];
    const y0 = beziers[0][0][1];
    let d = `M${x0} ${y0} `;

    for (let i=0; i<beziers.length; i++) {
        const ps = beziers[i];

        if (ps.length <= 1) { continue; }

        const [,p1,p2,p3] = ps;
        d += 
              ps.length === 2
            ? `L ${p1[0]} ${p1[1]} `
            : ps.length === 3
            ? `Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} `
            : `C ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]} `
    }

    // d += ' z';
    const $path = document.createElementNS(XMLNS, 'path');
    $path.setAttributeNS(null, "d", d);
    $path.setAttributeNS(null, "class", class_); 
    g.appendChild($path);

    return [$path];
}


export { drawBeziersAsSinglePath }
