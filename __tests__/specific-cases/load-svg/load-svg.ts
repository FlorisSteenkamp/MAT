import * as cheerio from 'cheerio';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';


async function loadSvgs(
        pathToSvg: string) {

    const absolutePath = resolve(process.cwd(), '__tests__', 'specific-cases', pathToSvg);
    const data = await readFile(absolutePath, 'utf8');

    const $ = cheerio.load(data, { xmlMode : true });

    const $svgs = $('glyph');

    const svgs: { name: string; d: string; }[] = [];
    for (let i=0; i<$svgs.length; i++) {
        const $svg = $svgs[i];
        const attribs = $svg.attribs;
        svgs.push({
            name: attribs["glyph-name"],
            d: attribs.d
        })
    }

    return svgs;
}


export { loadSvgs }
