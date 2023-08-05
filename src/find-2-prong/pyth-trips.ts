import { primitivePart } from "flo-poly";

/**
 * From https://www.geeksforgeeks.org/generate-pythagorean-triplets/
 * 
 * Function to generate pythagorean triplets smaller than limit
 */
function pythagoreanTriplets(
        limit: number): number[][] {

    // Triplet: a^2 + b^2 = c^2
    let a = 0;
    let b = 0;
    let c = 0;

    // Loop from 2 to max_limit
    let m = 2;

    const triples: number[][] = [];
    // Limiting c would limit all a, b and c
    while (c < limit) {
        for(let n=1; n<m; ++n) {
            a = m*m - n*n;
            b = 2*m*n;
            c = m*m + n*n;

            if (c > limit) { break; }

            triples.push([a,b,c]);
        }
        m++;
    }

    return triples;
}


function get1DegreeSpacingTriples() {
    let limit = 10000;
    const triplesRaw = pythagoreanTriplets(limit);
    const triplesRed = triplesRaw.map(triple => {
        let [x,y] = triple;
        [x,y] = primitivePart([x,y]);
        if (x > y) { [x,y] = [y,x]; }

        return [x,y];
    });

    triplesRed.sort((a,b) => {
        let res = a[0] - b[0];

        if (res !== 0) { return res; }

        return a[1] - b[1];
    });

    const triples: number[][] = [];
    for (let i=0; i<triplesRed.length; i++) {
        const tripleRedPrev = triplesRed[i-1];
        const tripleRed = triplesRed[i];
        if (tripleRedPrev === undefined ||
            tripleRed[0] !== tripleRedPrev[0] ||
            tripleRed[1] !== tripleRedPrev[1]) {

            triples.push(tripleRed);
        }
    }


    function toDeg(angle: number) {
        return angle*180/Math.PI;
    }

    const triplesWithAngles = triples.map(triple => {
        const [x,y] = triple;

        return [x,y,toDeg(Math.atan2(y,x))];
    }).sort((a,b) => a[2] - b[2]);//?

    triplesWithAngles.length;//?
    triplesWithAngles[0];//?
    triplesWithAngles[triplesWithAngles.length-1];//?

    const trips: number[][] = [];
    const GAP = 1;
    let prev = 45;
    for (let t of triplesWithAngles) {
        if (t[2] - prev > GAP) {
            trips.push(t);
            prev = t[2];
        }
    }

    return trips;
}


// get1DegreeSpacingTriples();

const triples = [
    [ 2184, 2263, 46.017740165645755 ],
    [ 2928, 3145, 47.046418040919235 ],
    [ 2760, 3071, 48.0530131573584 ],
    [ 1675, 1932, 49.075456953155594 ],
    [ 3003, 3596, 50.13492687612096 ],
    [ 3885, 4828, 51.177026282632845 ],
    [ 1825, 2352, 52.19084831477669 ],
    [ 3220, 4371, 53.621908600697374 ],
    [ 3036, 4277, 54.63121594688451 ],
    [ 935, 1368, 55.64819276850652 ],
    [ 2813, 4284, 56.70992357064812 ],
    [ 836, 1323, 57.71132243943304 ],
    [ 175, 288, 58.715507085582544 ],
    [ 1955, 3348, 59.718032329846196 ],
    [ 276, 493, 60.75825202273669 ],
    [ 8, 15, 61.92751306414704 ],
    [ 1404, 2747, 62.92828726173151 ],
    [ 39, 80, 64.01076641616699 ],
    [ 2825, 6072, 65.04978057558209 ],
    [ 1144, 2583, 66.11164562310735 ],
    [ 5, 12, 67.38013505195958 ],
    [ 168, 425, 68.4314042648748 ],
    [ 1995, 5332, 69.48636031660722 ],
    [ 1408, 3975, 70.49515011669244 ],
    [ 301, 900, 71.5077745088735 ],
    [ 1887, 6016, 72.5852594569592 ],
    [ 7, 24, 73.73979529168804 ],
    [ 2159, 7920, 74.75161499109633 ],
    [ 1815, 7208, 75.86654056719784 ],
    [ 1469, 6300, 76.87460298212505 ],
    [ 924, 4307, 77.89161621177033 ],
    [ 1008, 5135, 78.8940579339264 ],
    [ 204, 1147, 79.91509786165818 ],
    [ 315, 1972, 80.92445498418671 ],
    [ 355, 2508, 81.94347266702972 ],
    [ 520, 4209, 82.95709324615554 ],
    [ 19, 180, 83.97442499163333 ],
    [ 23, 264, 85.0208941560017 ],
    [ 29, 420, 86.05013197823607 ],
    [ 39, 760, 87.06239857122834 ],
    [ 120, 3599, 88.09031749225564 ],
    [ 127, 8064, 89.09772290642545 ]
];


export { triples }
