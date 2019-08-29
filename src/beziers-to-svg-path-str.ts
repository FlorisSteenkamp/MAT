
/**
 * Returns an SVG path string representation of the given cubic bezier loop.
 * @param beziers An array of cubic bezier curves each given as an array of 
 * control points.
 * @param decimalPlaces The number of decimal places in the returned path 
 * string.
 */
 function beziersToSvgPathStr(
        beziers: number[][][], 
        decimalPlaces: number = 10) {

    const D = decimalPlaces;

    let str = '';
    for (let i=0; i<beziers.length; i++) {
        let ps = beziers[i];
        if (i === 0) {
            str = 'M ' + 
                ps[0][0].toFixed(D) + ' ' + 
                ps[0][1].toFixed(D) + '\n';
        }
        
        str += 'C ' + 
            ps[1][0].toFixed(D) + ' ' + 
            ps[1][1].toFixed(D) + ' ' +
            ps[2][0].toFixed(D) + ' ' + 
            ps[2][1].toFixed(D) + ' ' +
            ps[3][0].toFixed(D) + ' ' + 
            ps[3][1].toFixed(D) + ' ' + '\n';
    }


    return str + ' z' + '\n';
}


export { beziersToSvgPathStr }
