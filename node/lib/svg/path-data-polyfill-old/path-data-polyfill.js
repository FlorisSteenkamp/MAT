'use strict';
// @info
//   Polyfill for SVG 2 getPathData() and setPathData() methods. Based on:
//   - SVGPathSeg polyfill by Philip Rogers (MIT License)
//     https://github.com/progers/pathseg
//   - SVGPathNormalizer by Tadahisa Motooka (MIT License)
//     https://github.com/motooka/SVGPathNormalizer/tree/master/src
//   - arcToCubicCurves() by Dmitry Baranovskiy (MIT License)
//     https://github.com/DmitryBaranovskiy/raphael/blob/v2.1.1/raphael.core.js#L1837
// @author
//   Jarosław Foksa
// @license
//   MIT License
function svgGetAndSetPathDataPolyFill() {
    if (!SVGPathElement.prototype.getPathData ||
        !SVGPathElement.prototype.setPathData) {
        applyPolyFill();
    }
}
function applyPolyFill() {
    let commandsMap = {
        Z: "Z", M: "M", L: "L", C: "C", Q: "Q", A: "A", H: "H", V: "V", S: "S", T: "T",
        z: "Z", m: "m", l: "l", c: "c", q: "q", a: "a", h: "h", v: "v", s: "s", t: "t"
    };
    let Source = function (string) {
        this._string = string;
        this._currentIndex = 0;
        this._endIndex = this._string.length;
        this._prevCommand = null;
        this._skipOptionalSpaces();
    };
    let isIE = window.navigator.userAgent.indexOf("MSIE ") !== -1;
    Source.prototype = {
        parseSegment: function () {
            let char = this._string[this._currentIndex];
            let command = commandsMap[char] ? commandsMap[char] : null;
            if (command === null) {
                // Possibly an implicit command. Not allowed if this is the first command.
                if (this._prevCommand === null) {
                    return null;
                }
                // Check for remaining coordinates in the current command.
                if ((char === "+" || char === "-" || char === "." ||
                    (char >= "0" && char <= "9")) &&
                    this._prevCommand !== "Z") {
                    if (this._prevCommand === "M") {
                        command = "L";
                    }
                    else if (this._prevCommand === "m") {
                        command = "l";
                    }
                    else {
                        command = this._prevCommand;
                    }
                }
                else {
                    command = null;
                }
                if (command === null) {
                    return null;
                }
            }
            else {
                this._currentIndex++;
            }
            this._prevCommand = command;
            let values = null;
            let cmd = command.toUpperCase();
            if (cmd === "H" || cmd === "V") {
                values = [this._parseNumber()];
            }
            else if (cmd === "M" || cmd === "L" || cmd === "T") {
                values = [this._parseNumber(), this._parseNumber()];
            }
            else if (cmd === "S" || cmd === "Q") {
                values = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber()];
            }
            else if (cmd === "C") {
                values = [
                    this._parseNumber(),
                    this._parseNumber(),
                    this._parseNumber(),
                    this._parseNumber(),
                    this._parseNumber(),
                    this._parseNumber()
                ];
            }
            else if (cmd === "A") {
                values = [
                    this._parseNumber(),
                    this._parseNumber(),
                    this._parseNumber(),
                    this._parseArcFlag(),
                    this._parseArcFlag(),
                    this._parseNumber(),
                    this._parseNumber()
                ];
            }
            else if (cmd === "Z") {
                this._skipOptionalSpaces();
                values = [];
            }
            if (values === null || values.indexOf(null) >= 0) {
                // Unknown command or known command with invalid values
                return null;
            }
            else {
                return { type: command, values };
            }
        },
        hasMoreData: function () {
            return this._currentIndex < this._endIndex;
        },
        peekSegmentType: function () {
            let char = this._string[this._currentIndex];
            return commandsMap[char] ? commandsMap[char] : null;
        },
        initialCommandIsMoveTo: function () {
            // If the path is empty it is still valid, so return true.
            if (!this.hasMoreData()) {
                return true;
            }
            let command = this.peekSegmentType();
            // Path must start with moveTo.
            return command === "M" || command === "m";
        },
        _isCurrentSpace: function () {
            let char = this._string[this._currentIndex];
            return char <= " " && (char === " " || char === "\n" || char === "\t" || char === "\r" || char === "\f");
        },
        _skipOptionalSpaces: function () {
            while (this._currentIndex < this._endIndex && this._isCurrentSpace()) {
                this._currentIndex += 1;
            }
            return this._currentIndex < this._endIndex;
        },
        _skipOptionalSpacesOrDelimiter: function () {
            if (this._currentIndex < this._endIndex &&
                !this._isCurrentSpace() &&
                this._string[this._currentIndex] !== ",") {
                return false;
            }
            if (this._skipOptionalSpaces()) {
                if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === ",") {
                    this._currentIndex += 1;
                    this._skipOptionalSpaces();
                }
            }
            return this._currentIndex < this._endIndex;
        },
        // Parse a number from an SVG path. This very closely follows genericParseNumber(...) from
        // Source/core/svg/SVGParserUtilities.cpp.
        // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
        _parseNumber: function () {
            let exponent = 0;
            let integer = 0;
            let frac = 1;
            let decimal = 0;
            let sign = 1;
            let expsign = 1;
            let startIndex = this._currentIndex;
            this._skipOptionalSpaces();
            // Read the sign.
            if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === "+") {
                this._currentIndex += 1;
            }
            else if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === "-") {
                this._currentIndex += 1;
                sign = -1;
            }
            if (this._currentIndex === this._endIndex ||
                ((this._string[this._currentIndex] < "0" || this._string[this._currentIndex] > "9") &&
                    this._string[this._currentIndex] !== ".")) {
                // The first character of a number must be one of [0-9+-.].
                return null;
            }
            // Read the integer part, build right-to-left.
            let startIntPartIndex = this._currentIndex;
            while (this._currentIndex < this._endIndex &&
                this._string[this._currentIndex] >= "0" &&
                this._string[this._currentIndex] <= "9") {
                this._currentIndex += 1; // Advance to first non-digit.
            }
            if (this._currentIndex !== startIntPartIndex) {
                let scanIntPartIndex = this._currentIndex - 1;
                let multiplier = 1;
                while (scanIntPartIndex >= startIntPartIndex) {
                    integer += multiplier * (this._string[scanIntPartIndex] - "0");
                    scanIntPartIndex -= 1;
                    multiplier *= 10;
                }
            }
            // Read the decimals.
            if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === ".") {
                this._currentIndex += 1;
                // There must be a least one digit following the .
                if (this._currentIndex >= this._endIndex ||
                    this._string[this._currentIndex] < "0" ||
                    this._string[this._currentIndex] > "9") {
                    return null;
                }
                while (this._currentIndex < this._endIndex &&
                    this._string[this._currentIndex] >= "0" &&
                    this._string[this._currentIndex] <= "9") {
                    decimal += (this._string[this._currentIndex] - "0") * (frac *= 0.1);
                    this._currentIndex += 1;
                }
            }
            // Read the exponent part.
            if (this._currentIndex !== startIndex &&
                this._currentIndex + 1 < this._endIndex &&
                (this._string[this._currentIndex] === "e" || this._string[this._currentIndex] === "E") &&
                (this._string[this._currentIndex + 1] !== "x" && this._string[this._currentIndex + 1] !== "m")) {
                this._currentIndex += 1;
                // Read the sign of the exponent.
                if (this._string[this._currentIndex] === "+") {
                    this._currentIndex += 1;
                }
                else if (this._string[this._currentIndex] === "-") {
                    this._currentIndex += 1;
                    expsign = -1;
                }
                // There must be an exponent.
                if (this._currentIndex >= this._endIndex ||
                    this._string[this._currentIndex] < "0" ||
                    this._string[this._currentIndex] > "9") {
                    return null;
                }
                while (this._currentIndex < this._endIndex &&
                    this._string[this._currentIndex] >= "0" &&
                    this._string[this._currentIndex] <= "9") {
                    exponent *= 10;
                    exponent += (this._string[this._currentIndex] - "0");
                    this._currentIndex += 1;
                }
            }
            let number = integer + decimal;
            number *= sign;
            if (exponent) {
                number *= Math.pow(10, expsign * exponent);
            }
            if (startIndex === this._currentIndex) {
                return null;
            }
            this._skipOptionalSpacesOrDelimiter();
            return number;
        },
        _parseArcFlag: function () {
            if (this._currentIndex >= this._endIndex) {
                return null;
            }
            let flag = null;
            let flagChar = this._string[this._currentIndex];
            this._currentIndex += 1;
            if (flagChar === "0") {
                flag = 0;
            }
            else if (flagChar === "1") {
                flag = 1;
            }
            else {
                return null;
            }
            this._skipOptionalSpacesOrDelimiter();
            return flag;
        }
    };
    let parsePathDataString = function (string) {
        if (!string || string.length === 0)
            return [];
        let source = new Source(string);
        let pathData = [];
        if (source.initialCommandIsMoveTo()) {
            while (source.hasMoreData()) {
                let pathSeg = source.parseSegment();
                if (pathSeg === null) {
                    break;
                }
                else {
                    pathData.push(pathSeg);
                }
            }
        }
        return pathData;
    };
    let setAttribute = SVGPathElement.prototype.setAttribute;
    let removeAttribute = SVGPathElement.prototype.removeAttribute;
    let symbols;
    if (window.Symbol) {
        symbols = { cachedPathData: Symbol(), cachedNormalizedPathData: Symbol() };
    }
    else {
        symbols = { cachedPathData: "__cachedPathData", cachedNormalizedPathData: "__cachedNormalizedPathData" };
    }
    // @info
    //   Get an array of corresponding cubic bezier curve parameters for given arc curve paramters.
    let arcToCubicCurves = function (x1, y1, x2, y2, r1, r2, angle, largeArcFlag, sweepFlag, _recursive) {
        let degToRad = function (degrees) {
            return (Math.PI * degrees) / 180;
        };
        let rotate = function (x, y, angleRad) {
            let X = x * Math.cos(angleRad) - y * Math.sin(angleRad);
            let Y = x * Math.sin(angleRad) + y * Math.cos(angleRad);
            return { x: X, y: Y };
        };
        let angleRad = degToRad(angle);
        let params = [];
        let f1, f2, cx, cy;
        if (_recursive) {
            f1 = _recursive[0];
            f2 = _recursive[1];
            cx = _recursive[2];
            cy = _recursive[3];
        }
        else {
            let p1 = rotate(x1, y1, -angleRad);
            x1 = p1.x;
            y1 = p1.y;
            let p2 = rotate(x2, y2, -angleRad);
            x2 = p2.x;
            y2 = p2.y;
            let x = (x1 - x2) / 2;
            let y = (y1 - y2) / 2;
            let h = (x * x) / (r1 * r1) + (y * y) / (r2 * r2);
            if (h > 1) {
                h = Math.sqrt(h);
                r1 = h * r1;
                r2 = h * r2;
            }
            let sign;
            if (largeArcFlag === sweepFlag) {
                sign = -1;
            }
            else {
                sign = 1;
            }
            let r1Pow = r1 * r1;
            let r2Pow = r2 * r2;
            let left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;
            let right = r1Pow * y * y + r2Pow * x * x;
            let k = sign * Math.sqrt(Math.abs(left / right));
            cx = k * r1 * y / r2 + (x1 + x2) / 2;
            cy = k * -r2 * x / r1 + (y1 + y2) / 2;
            f1 = Math.asin(((y1 - cy) / r2).toFixed(9));
            f2 = Math.asin(((y2 - cy) / r2).toFixed(9));
            if (x1 < cx) {
                f1 = Math.PI - f1;
            }
            if (x2 < cx) {
                f2 = Math.PI - f2;
            }
            if (f1 < 0) {
                f1 = Math.PI * 2 + f1;
            }
            if (f2 < 0) {
                f2 = Math.PI * 2 + f2;
            }
            if (sweepFlag && f1 > f2) {
                f1 = f1 - Math.PI * 2;
            }
            if (!sweepFlag && f2 > f1) {
                f2 = f2 - Math.PI * 2;
            }
        }
        let df = f2 - f1;
        if (Math.abs(df) > (Math.PI * 120 / 180)) {
            let f2old = f2;
            let x2old = x2;
            let y2old = y2;
            if (sweepFlag && f2 > f1) {
                f2 = f1 + (Math.PI * 120 / 180) * (1);
            }
            else {
                f2 = f1 + (Math.PI * 120 / 180) * (-1);
            }
            x2 = cx + r1 * Math.cos(f2);
            y2 = cy + r2 * Math.sin(f2);
            params = arcToCubicCurves(x2, y2, x2old, y2old, r1, r2, angle, 0, sweepFlag, [f2, f2old, cx, cy]);
        }
        df = f2 - f1;
        let c1 = Math.cos(f1);
        let s1 = Math.sin(f1);
        let c2 = Math.cos(f2);
        let s2 = Math.sin(f2);
        let t = Math.tan(df / 4);
        let hx = 4 / 3 * r1 * t;
        let hy = 4 / 3 * r2 * t;
        let m1 = [x1, y1];
        let m2 = [x1 + hx * s1, y1 - hy * c1];
        let m3 = [x2 + hx * s2, y2 - hy * c2];
        let m4 = [x2, y2];
        m2[0] = 2 * m1[0] - m2[0];
        m2[1] = 2 * m1[1] - m2[1];
        if (_recursive) {
            return [m2, m3, m4].concat(params);
        }
        else {
            params = [m2, m3, m4].concat(params).join().split(",");
            let curves = [];
            let curveParams = [];
            params.forEach(function (param, i) {
                if (i % 2) {
                    curveParams.push(rotate(params[i - 1], params[i], angleRad).y);
                }
                else {
                    curveParams.push(rotate(params[i], params[i + 1], angleRad).x);
                }
                if (curveParams.length === 6) {
                    curves.push(curveParams);
                    curveParams = [];
                }
            });
            return curves;
        }
    };
    let clonePathData = function (pathData) {
        return pathData.map(function (seg) {
            return { type: seg.type, values: Array.prototype.slice.call(seg.values) };
        });
    };
    // @info
    //   Takes any path data, returns path data that consists only from absolute commands.
    let absolutizePathData = function (pathData) {
        let absolutizedPathData = [];
        let currentX = null;
        let currentY = null;
        let subpathX = null;
        let subpathY = null;
        pathData.forEach(function (seg) {
            let type = seg.type;
            if (type === "M") {
                let x = seg.values[0];
                let y = seg.values[1];
                absolutizedPathData.push({ type: "M", values: [x, y] });
                subpathX = x;
                subpathY = y;
                currentX = x;
                currentY = y;
            }
            else if (type === "m") {
                let x = currentX + seg.values[0];
                let y = currentY + seg.values[1];
                absolutizedPathData.push({ type: "M", values: [x, y] });
                subpathX = x;
                subpathY = y;
                currentX = x;
                currentY = y;
            }
            else if (type === "L") {
                let x = seg.values[0];
                let y = seg.values[1];
                absolutizedPathData.push({ type: "L", values: [x, y] });
                currentX = x;
                currentY = y;
            }
            else if (type === "l") {
                let x = currentX + seg.values[0];
                let y = currentY + seg.values[1];
                absolutizedPathData.push({ type: "L", values: [x, y] });
                currentX = x;
                currentY = y;
            }
            else if (type === "C") {
                let x1 = seg.values[0];
                let y1 = seg.values[1];
                let x2 = seg.values[2];
                let y2 = seg.values[3];
                let x = seg.values[4];
                let y = seg.values[5];
                absolutizedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });
                currentX = x;
                currentY = y;
            }
            else if (type === "c") {
                let x1 = currentX + seg.values[0];
                let y1 = currentY + seg.values[1];
                let x2 = currentX + seg.values[2];
                let y2 = currentY + seg.values[3];
                let x = currentX + seg.values[4];
                let y = currentY + seg.values[5];
                absolutizedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });
                currentX = x;
                currentY = y;
            }
            else if (type === "Q") {
                let x1 = seg.values[0];
                let y1 = seg.values[1];
                let x = seg.values[2];
                let y = seg.values[3];
                absolutizedPathData.push({ type: "Q", values: [x1, y1, x, y] });
                currentX = x;
                currentY = y;
            }
            else if (type === "q") {
                let x1 = currentX + seg.values[0];
                let y1 = currentY + seg.values[1];
                let x = currentX + seg.values[2];
                let y = currentY + seg.values[3];
                absolutizedPathData.push({ type: "Q", values: [x1, y1, x, y] });
                currentX = x;
                currentY = y;
            }
            else if (type === "A") {
                let x = seg.values[5];
                let y = seg.values[6];
                absolutizedPathData.push({
                    type: "A",
                    values: [seg.values[0], seg.values[1], seg.values[2], seg.values[3], seg.values[4], x, y]
                });
                currentX = x;
                currentY = y;
            }
            else if (type === "a") {
                let x = currentX + seg.values[5];
                let y = currentY + seg.values[6];
                absolutizedPathData.push({
                    type: "A",
                    values: [seg.values[0], seg.values[1], seg.values[2], seg.values[3], seg.values[4], x, y]
                });
                currentX = x;
                currentY = y;
            }
            else if (type === "H") {
                let x = seg.values[0];
                absolutizedPathData.push({ type: "H", values: [x] });
                currentX = x;
            }
            else if (type === "h") {
                let x = currentX + seg.values[0];
                absolutizedPathData.push({ type: "H", values: [x] });
                currentX = x;
            }
            else if (type === "V") {
                let y = seg.values[0];
                absolutizedPathData.push({ type: "V", values: [y] });
                currentY = y;
            }
            else if (type === "v") {
                let y = currentY + seg.values[0];
                absolutizedPathData.push({ type: "V", values: [y] });
                currentY = y;
            }
            else if (type === "S") {
                let x2 = seg.values[0];
                let y2 = seg.values[1];
                let x = seg.values[2];
                let y = seg.values[3];
                absolutizedPathData.push({ type: "S", values: [x2, y2, x, y] });
                currentX = x;
                currentY = y;
            }
            else if (type === "s") {
                let x2 = currentX + seg.values[0];
                let y2 = currentY + seg.values[1];
                let x = currentX + seg.values[2];
                let y = currentY + seg.values[3];
                absolutizedPathData.push({ type: "S", values: [x2, y2, x, y] });
                currentX = x;
                currentY = y;
            }
            else if (type === "T") {
                let x = seg.values[0];
                let y = seg.values[1];
                absolutizedPathData.push({ type: "T", values: [x, y] });
                currentX = x;
                currentY = y;
            }
            else if (type === "t") {
                let x = currentX + seg.values[0];
                let y = currentY + seg.values[1];
                absolutizedPathData.push({ type: "T", values: [x, y] });
                currentX = x;
                currentY = y;
            }
            else if (type === "Z" || type === "z") {
                absolutizedPathData.push({ type: "Z", values: [] });
                currentX = subpathX;
                currentY = subpathY;
            }
        });
        return absolutizedPathData;
    };
    // @info
    //   Takes path data that consists only from absolute commands, returns path data that consists only from
    //   "M", "L", "C" and "Z" commands.
    let reducePathData = function (pathData) {
        let reducedPathData = [];
        let lastType = null;
        let lastControlX = null;
        let lastControlY = null;
        let currentX = null;
        let currentY = null;
        let subpathX = null;
        let subpathY = null;
        pathData.forEach(function (seg) {
            if (seg.type === "M") {
                let x = seg.values[0];
                let y = seg.values[1];
                reducedPathData.push({ type: "M", values: [x, y] });
                subpathX = x;
                subpathY = y;
                currentX = x;
                currentY = y;
            }
            else if (seg.type === "C") {
                let x1 = seg.values[0];
                let y1 = seg.values[1];
                let x2 = seg.values[2];
                let y2 = seg.values[3];
                let x = seg.values[4];
                let y = seg.values[5];
                reducedPathData.push({ type: "C", values: [x1, y1, x2, y2, x, y] });
                lastControlX = x2;
                lastControlY = y2;
                currentX = x;
                currentY = y;
            }
            else if (seg.type === "L") {
                let x = seg.values[0];
                let y = seg.values[1];
                reducedPathData.push({ type: "L", values: [x, y] });
                currentX = x;
                currentY = y;
            }
            else if (seg.type === "H") {
                let x = seg.values[0];
                reducedPathData.push({ type: "L", values: [x, currentY] });
                currentX = x;
            }
            else if (seg.type === "V") {
                let y = seg.values[0];
                reducedPathData.push({ type: "L", values: [currentX, y] });
                currentY = y;
            }
            else if (seg.type === "S") {
                let x2 = seg.values[0];
                let y2 = seg.values[1];
                let x = seg.values[2];
                let y = seg.values[3];
                let cx1, cy1;
                if (lastType === "C" || lastType === "S") {
                    cx1 = currentX + (currentX - lastControlX);
                    cy1 = currentY + (currentY - lastControlY);
                }
                else {
                    cx1 = currentX;
                    cy1 = currentY;
                }
                reducedPathData.push({ type: "C", values: [cx1, cy1, x2, y2, x, y] });
                lastControlX = x2;
                lastControlY = y2;
                currentX = x;
                currentY = y;
            }
            else if (seg.type === "T") {
                let x = seg.values[0];
                let y = seg.values[1];
                let x1, y1;
                if (lastType === "Q" || lastType === "T") {
                    x1 = currentX + (currentX - lastControlX);
                    y1 = currentY + (currentY - lastControlY);
                }
                else {
                    x1 = currentX;
                    y1 = currentY;
                }
                let cx1 = currentX + 2 * (x1 - currentX) / 3;
                let cy1 = currentY + 2 * (y1 - currentY) / 3;
                let cx2 = x + 2 * (x1 - x) / 3;
                let cy2 = y + 2 * (y1 - y) / 3;
                reducedPathData.push({ type: "C", values: [cx1, cy1, cx2, cy2, x, y] });
                lastControlX = x1;
                lastControlY = y1;
                currentX = x;
                currentY = y;
            }
            else if (seg.type === "Q") {
                let x1 = seg.values[0];
                let y1 = seg.values[1];
                let x = seg.values[2];
                let y = seg.values[3];
                let cx1 = currentX + 2 * (x1 - currentX) / 3;
                let cy1 = currentY + 2 * (y1 - currentY) / 3;
                let cx2 = x + 2 * (x1 - x) / 3;
                let cy2 = y + 2 * (y1 - y) / 3;
                reducedPathData.push({ type: "C", values: [cx1, cy1, cx2, cy2, x, y] });
                lastControlX = x1;
                lastControlY = y1;
                currentX = x;
                currentY = y;
            }
            else if (seg.type === "A") {
                let r1 = seg.values[0];
                let r2 = seg.values[1];
                let angle = seg.values[2];
                let largeArcFlag = seg.values[3];
                let sweepFlag = seg.values[4];
                let x = seg.values[5];
                let y = seg.values[6];
                if (r1 === 0 || r2 === 0) {
                    reducedPathData.push({ type: "C", values: [currentX, currentY, x, y, x, y] });
                    currentX = x;
                    currentY = y;
                }
                else {
                    if (currentX !== x || currentY !== y) {
                        let curves = arcToCubicCurves(currentX, currentY, x, y, r1, r2, angle, largeArcFlag, sweepFlag);
                        curves.forEach(function (curve) {
                            reducedPathData.push({ type: "C", values: curve });
                            currentX = x;
                            currentY = y;
                        });
                    }
                }
            }
            else if (seg.type === "Z") {
                reducedPathData.push(seg);
                currentX = subpathX;
                currentY = subpathY;
            }
            lastType = seg.type;
        });
        return reducedPathData;
    };
    SVGPathElement.prototype.setAttribute = function (name, value) {
        if (name === "d") {
            this[symbols.cachedPathData] = null;
            this[symbols.cachedNormalizedPathData] = null;
        }
        setAttribute.call(this, name, value);
    };
    SVGPathElement.prototype.removeAttribute = function (name, value) {
        if (name === "d") {
            this[symbols.cachedPathData] = null;
            this[symbols.cachedNormalizedPathData] = null;
        }
        removeAttribute.call(this, name);
    };
    SVGPathElement.prototype.getPathData = function (options) {
        if (options && options.normalize) {
            if (this[symbols.cachedNormalizedPathData]) {
                return clonePathData(this[symbols.cachedNormalizedPathData]);
            }
            else {
                let pathData;
                if (this[symbols.cachedPathData]) {
                    pathData = clonePathData(this[symbols.cachedPathData]);
                }
                else {
                    pathData = parsePathDataString(this.getAttribute("d") || "");
                    this[symbols.cachedPathData] = clonePathData(pathData);
                }
                let normalizedPathData = reducePathData(absolutizePathData(pathData));
                this[symbols.cachedNormalizedPathData] = clonePathData(normalizedPathData);
                return normalizedPathData;
            }
        }
        else {
            if (this[symbols.cachedPathData]) {
                return clonePathData(this[symbols.cachedPathData]);
            }
            else {
                let pathData = parsePathDataString(this.getAttribute("d") || "");
                this[symbols.cachedPathData] = clonePathData(pathData);
                return pathData;
            }
        }
    };
    SVGPathElement.prototype.setPathData = function (pathData) {
        if (pathData.length === 0) {
            if (isIE) {
                // @bugfix https://github.com/mbostock/d3/issues/1737
                this.setAttribute("d", "");
            }
            else {
                this.removeAttribute("d");
            }
        }
        else {
            let d = "";
            for (let i = 0, l = pathData.length; i < l; i += 1) {
                let seg = pathData[i];
                if (i > 0) {
                    d += " ";
                }
                d += seg.type;
                if (seg.values) {
                    d += " " + seg.values.join(" ");
                }
            }
            this.setAttribute("d", d);
        }
    };
}
module.exports = svgGetAndSetPathDataPolyFill;
