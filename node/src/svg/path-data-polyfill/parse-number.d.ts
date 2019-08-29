import { Source } from './source';
/**
 * @hidden
 * Parse a number from an SVG path. This very closely follows genericParseNumber(...) from
 * Source/core/svg/SVGParserUtilities.cpp.
 * Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
 * @param source
 */
declare function parseNumber(source: Source): number;
export { parseNumber };
