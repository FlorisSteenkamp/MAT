
function quadraticToCubic(ps: number[][]) {
    let [p0,p1,p2] = ps;

    return [
        p0, 
        [
            p0[0] + (2/3)*(p1[0]-p0[0]), 
            p0[1] + (2/3)*(p1[1]-p0[1])
        ], 
        [
            p2[0] + (2/3)*(p1[0]-p2[0]), 
            p2[1] + (2/3)*(p1[1]-p2[1])
        ], 
        p2
    ];
}


export { quadraticToCubic }
