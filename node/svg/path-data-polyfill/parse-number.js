"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 * Parse a number from an SVG path. This very closely follows genericParseNumber(...) from
 * Source/core/svg/SVGParserUtilities.cpp.
 * Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
 * @param source
 */
function parseNumber(source) {
    var exponent = 0;
    var integer = 0;
    var frac = 1;
    var decimal = 0;
    var sign = 1;
    var expsign = 1;
    var startIndex = source._currentIndex;
    source._skipOptionalSpaces();
    // Read the sign.
    if (source._currentIndex < source._endIndex && source._string[source._currentIndex] === "+") {
        source._currentIndex += 1;
    }
    else if (source._currentIndex < source._endIndex && source._string[source._currentIndex] === "-") {
        source._currentIndex += 1;
        sign = -1;
    }
    if (source._currentIndex === source._endIndex ||
        ((source._string[source._currentIndex] < "0" || source._string[source._currentIndex] > "9") &&
            source._string[source._currentIndex] !== ".")) {
        // The first character of a number must be one of [0-9+-.].
        return null;
    }
    // Read the integer part, build right-to-left.
    var startIntPartIndex = source._currentIndex;
    while (source._currentIndex < source._endIndex &&
        source._string[source._currentIndex] >= "0" &&
        source._string[source._currentIndex] <= "9") {
        source._currentIndex += 1; // Advance to first non-digit.
    }
    if (source._currentIndex !== startIntPartIndex) {
        var scanIntPartIndex = source._currentIndex - 1;
        var multiplier = 1;
        while (scanIntPartIndex >= startIntPartIndex) {
            integer += multiplier * (Number(source._string[scanIntPartIndex]) - 0);
            scanIntPartIndex -= 1;
            multiplier *= 10;
        }
    }
    // Read the decimals.
    if (source._currentIndex < source._endIndex && source._string[source._currentIndex] === ".") {
        source._currentIndex += 1;
        // There must be a least one digit following the .
        if (source._currentIndex >= source._endIndex ||
            source._string[source._currentIndex] < "0" ||
            source._string[source._currentIndex] > "9") {
            return null;
        }
        while (source._currentIndex < source._endIndex &&
            source._string[source._currentIndex] >= "0" &&
            source._string[source._currentIndex] <= "9") {
            frac *= 10;
            decimal += (Number(source._string.charAt(source._currentIndex))) / frac;
            source._currentIndex += 1;
        }
    }
    // Read the exponent part.
    if (source._currentIndex !== startIndex &&
        source._currentIndex + 1 < source._endIndex &&
        (source._string[source._currentIndex] === "e" || source._string[source._currentIndex] === "E") &&
        (source._string[source._currentIndex + 1] !== "x" && source._string[source._currentIndex + 1] !== "m")) {
        source._currentIndex += 1;
        // Read the sign of the exponent.
        if (source._string[source._currentIndex] === "+") {
            source._currentIndex += 1;
        }
        else if (source._string[source._currentIndex] === "-") {
            source._currentIndex += 1;
            expsign = -1;
        }
        // There must be an exponent.
        if (source._currentIndex >= source._endIndex ||
            source._string[source._currentIndex] < "0" ||
            source._string[source._currentIndex] > "9") {
            return null;
        }
        while (source._currentIndex < source._endIndex &&
            source._string[source._currentIndex] >= "0" &&
            source._string[source._currentIndex] <= "9") {
            exponent *= 10;
            exponent += (Number(source._string[source._currentIndex]));
            source._currentIndex += 1;
        }
    }
    var number = integer + decimal;
    number *= sign;
    if (exponent) {
        number *= Math.pow(10, expsign * exponent);
    }
    if (startIndex === source._currentIndex) {
        return null;
    }
    source._skipOptionalSpacesOrDelimiter();
    return number;
}
exports.parseNumber = parseNumber;
//# sourceMappingURL=parse-number.js.map