import { describe, expect, test } from '@jest/globals';
import { reconstructFromMats } from '../../src/reconstruct-from-mat/reconstruct-from-mat.js';
import { findMats } from '../../src/find-mat/find-mats.js';
import { loadSvgs } from './load-svg/load-svg.js';
import { getPathsFromStr, ddGetShapeArea, simplifyPaths } from 'flo-boolean';
import { sum } from '../../src/utils/sum.js';
import { Mat } from '../../src/mat/mat.js';

const { abs, max, sqrt } = Math;


const MIN_NUM_ACCURATE_BITS_SQRT_AREA = 14;
const MIN_NUM_ACCURATE_BITS_RADIUS = 20;


type TestCase = {
    filename: string;
    svgNames: string[];
}


const testCaseSvgs = [
    "Q_V",
    // ".notdef", "woodland", "exclam", "testD", "testL", "testO",
    // "testComplex", "ampersand", "testComplexish", "quotesingle", "parenleft", "parenright",
    // "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two",
    // "three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon",
    // "less", "equal", "greater", "question", "at", "A", "B", "C", "D", "E2",
    // "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "T2",
    // "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum",
    // "underscore", "grave", "a", "b", "c", "d", "e", "f", "g", "h2", "h", "i", "j",
    // "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w",
    // "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", "Agrave", "Aacute",
    // "Acircumflex", "Atilde", "Adieresis", "Aring", "AE", "Ccedilla", "Eth",

    // "3",
    // "ae", "exclammm", "MM", "Mt", "Mt2", "Mt3", "Mt4", "Mt5",
    // "Mth", "notdef", "onehalf", "yen", "ant", "arab",
    // "bump_tube1",
    // "china1", "circle_in_circle", "circle_in_square", "concave_poly",
    // "EEE", "fff", "gecko", "hart",
    // "A-2", "B-2",
    // "CCC", "DDD", "E-2", "holepole", "holy_poly", "intersecting", "intersecting1",
    // "koldat", "koldat14", "koldat15", "koldat16", "koldat17", "koldat18",
    // "koldat19", "koldat2", "koldat20", "koldat21", "koldat22", "koldat23", "koldat24", "koldat25",
    // "koldat26", "koldat3", "koldat4",
    // "koldat52", "koldat53", "koldat54",
    // "koldat55", "koldat56", "koldat57", "koldat58", "koldat59",
    // "koldat60", "koldat61",
    // "koldat62", "koldat63", "koldat64", "koldat7", "Lamda",
    // "lb",
    // "matthew",
    // "new1",
    // "new2", "new3", "noobd3v1", "noobd3v2", "OO", "PP", "p1", "p2",
    // "p3", "p4", "p5", "play1", "play2",
    // "l1", "l2", "poly", "poly-04",
    // "poly-11", "poly-12", "poly-121",
    // "ra", "SSS", "simple",
    // "so", "square", "square_in_circle", "square_in_square",
    // "T2",
    // "geck1", "t4", "test1", "test2", "test3", "test4", "tt", "two_hole"
]

test('Should correctly reconstruct original shape from medial axis for specific test cases', async function() {
    const testCases: TestCase[] = [
        {
            filename: 'achispado',
            svgNames: testCaseSvgs
            // svgNames: ['percent']
        }
    ];

    for (const testCase of testCases) {
        await testIt(testCase);
    }


    async function testIt(
            testCase: TestCase) {

        const { filename, svgNames } = testCase;

        const svgs = await loadSvgs(`./test-svgs/${filename}.svg`);

        for (const svgName of svgNames) {
            const pathStr = svgs.find(glyph => glyph.name === svgName)!.d;

            const bezierLoops = getPathsFromStr(pathStr);

            const loopss = simplifyPaths(bezierLoops, { forceOrientationNegative: true });

            let mats: Mat[];
            try {
                mats = findMats(bezierLoops, {
                    applySat: false,
                    simplify: false,
                    satScale: 1.01,
                    maxCurviness: 0.25,
                    maxLength: 40,
                    angleIncrement: 15,
                    // simplifyTolerance: 2**-5
                    // minBezLength-\ 
                });
            } catch (e) {
                console.log(`Unable to find MATs for ${svgName}`)
                throw e;
            }

            const maxPO2 = max(...mats.map(mat => mat.meta.maxCoordPowerOf2));

            const areass = loopss.map(loops => {
                const areas = loops.map(loop => ddGetShapeArea(loop.beziers)[1]);
                return areas;
            });

            const piecesss = reconstructFromMats(mats, MIN_NUM_ACCURATE_BITS_RADIUS);

            const areass_ = piecesss.map(piecess => {
                return piecess.map(loop => {
                    return ddGetShapeArea(loop)[1];
                });
            });

            checkAreas(maxPO2, svgName, areass, areass_);
        }
    }
});


function checkAreas(
        maxPO2: number,
        svgName: string,
        areass: number[][],
        areass_: number[][]) {

    if (areass.length !== areass_.length) {
        throw new Error('number of areas mismatch')
    }

    const areas = areass.map(sum);
    const areas_ = areass_.map(sum);

    const tol = 2**(maxPO2 - MIN_NUM_ACCURATE_BITS_SQRT_AREA);

    for (let i=0; i<areas.length; i++) {
        const area = areas[i];
        const area_ = areas_[i];

        // area;//?
        // area_;//?
        const err = sqrt(abs(area)) - sqrt(abs(area_));

        if (err > tol) {
            throw new Error(`Areas mismatch (${svgName}), area idx ${i}, found: sqrt(area): ${sqrt(abs(area))} vs ${sqrt(abs(area_))}, err: ${err}, tol: ${tol}`);
        }
    }
}
