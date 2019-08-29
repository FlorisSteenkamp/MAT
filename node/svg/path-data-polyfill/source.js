"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_number_1 = require("./parse-number");
/** @hidden */
const COMMAND_MAP = {
    "Z": "Z", "M": "M", "L": "L", "C": "C", "Q": "Q", "A": "A", "H": "H", "V": "V", "S": "S", "T": "T",
    "z": "Z", "m": "m", "l": "l", "c": "c", "q": "q", "a": "a", "h": "h", "v": "v", "s": "s", "t": "t"
};
/** @hidden */
class Source {
    constructor(string) {
        this._string = string;
        this._currentIndex = 0;
        this._endIndex = this._string.length;
        this._prevCommand = null;
        this._skipOptionalSpaces();
    }
    parseSegment() {
        var char = this._string[this._currentIndex];
        var command = COMMAND_MAP[char] ? COMMAND_MAP[char] : null;
        if (command === null) {
            // Possibly an implicit command. Not allowed if this is the first command.
            if (this._prevCommand === null) {
                return null;
            }
            // Check for remaining coordinates in the current command.
            if ((char === "+" || char === "-" || char === "." || (char >= "0" && char <= "9")) && this._prevCommand !== "Z") {
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
            this._currentIndex += 1;
        }
        this._prevCommand = command;
        var values = null;
        var cmd = command.toUpperCase();
        if (cmd === "H" || cmd === "V") {
            values = [parse_number_1.parseNumber(this)];
        }
        else if (cmd === "M" || cmd === "L" || cmd === "T") {
            values = [parse_number_1.parseNumber(this), parse_number_1.parseNumber(this)];
        }
        else if (cmd === "S" || cmd === "Q") {
            values = [parse_number_1.parseNumber(this), parse_number_1.parseNumber(this), parse_number_1.parseNumber(this), parse_number_1.parseNumber(this)];
        }
        else if (cmd === "C") {
            values = [
                parse_number_1.parseNumber(this),
                parse_number_1.parseNumber(this),
                parse_number_1.parseNumber(this),
                parse_number_1.parseNumber(this),
                parse_number_1.parseNumber(this),
                parse_number_1.parseNumber(this)
            ];
        }
        else if (cmd === "A") {
            values = [
                parse_number_1.parseNumber(this),
                parse_number_1.parseNumber(this),
                parse_number_1.parseNumber(this),
                this._parseArcFlag(),
                this._parseArcFlag(),
                parse_number_1.parseNumber(this),
                parse_number_1.parseNumber(this)
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
    }
    hasMoreData() {
        return this._currentIndex < this._endIndex;
    }
    peekSegmentType() {
        var char = this._string[this._currentIndex];
        return COMMAND_MAP[char] ? COMMAND_MAP[char] : null;
    }
    initialCommandIsMoveTo() {
        // If the path is empty it is still valid, so return true.
        if (!this.hasMoreData()) {
            return true;
        }
        var command = this.peekSegmentType();
        // Path must start with moveTo.
        return command === "M" || command === "m";
    }
    _isCurrentSpace() {
        var char = this._string[this._currentIndex];
        return char <= " " && (char === " " || char === "\n" || char === "\t" || char === "\r" || char === "\f");
    }
    _skipOptionalSpaces() {
        while (this._currentIndex < this._endIndex && this._isCurrentSpace()) {
            this._currentIndex += 1;
        }
        return this._currentIndex < this._endIndex;
    }
    _skipOptionalSpacesOrDelimiter() {
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
    }
    _parseArcFlag() {
        if (this._currentIndex >= this._endIndex) {
            return null;
        }
        var flag = null;
        var flagChar = this._string[this._currentIndex];
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
}
exports.Source = Source;
//# sourceMappingURL=source.js.map