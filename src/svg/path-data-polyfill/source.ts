
import { parseNumber } from './parse-number';

/** @hidden */
const COMMAND_MAP: { [index:string]: string } = {
    "Z":"Z", "M":"M", "L":"L", "C":"C", "Q":"Q", "A":"A", "H":"H", "V":"V", "S":"S", "T":"T",
    "z":"Z", "m":"m", "l":"l", "c":"c", "q":"q", "a":"a", "h":"h", "v":"v", "s":"s", "t":"t"
};


/** @hidden */
class Source {
    _string: string;
    _currentIndex: number;
    _endIndex: number;
    _prevCommand: string;


    constructor(string: string) {
        this._string = string;
        this._currentIndex = 0;
        this._endIndex = this._string.length;
        this._prevCommand = null;
        this._skipOptionalSpaces();
    }

    
    parseSegment(): { type: string, values: number[] } {
        var char = this._string[this._currentIndex];
        var command = COMMAND_MAP[char] ? COMMAND_MAP[char] : null;

        if (command === null) {
            // Possibly an implicit command. Not allowed if this is the first command.
            if (this._prevCommand === null) {
                return null;
            }

            // Check for remaining coordinates in the current command.
            if (
                (char === "+" || char === "-" || char === "." || (char >= "0" && char <= "9")) && this._prevCommand !== "Z"
            ) {
                if (this._prevCommand === "M") {
                    command = "L";
                } else if (this._prevCommand === "m") {
                    command = "l";
                } else {
                    command = this._prevCommand;
                }
            } else {
                command = null;
            }

            if (command === null) {
                return null;
            }
        } else {
            this._currentIndex += 1;
        }

        this._prevCommand = command;

        var values: number[] = null;
        var cmd = command.toUpperCase();

        if (cmd === "H" || cmd === "V") {
            values = [parseNumber(this)];
        } else if (cmd === "M" || cmd === "L" || cmd === "T") {
            values = [parseNumber(this), parseNumber(this)];
        } else if (cmd === "S" || cmd === "Q") {
            values = [parseNumber(this), parseNumber(this), parseNumber(this), parseNumber(this)];
        } else if (cmd === "C") {
            values = [
                parseNumber(this),
                parseNumber(this),
                parseNumber(this),
                parseNumber(this),
                parseNumber(this),
                parseNumber(this)
            ];
        } else if (cmd === "A") {
            values = [
                parseNumber(this),
                parseNumber(this),
                parseNumber(this),
                this._parseArcFlag(),
                this._parseArcFlag(),
                parseNumber(this),
                parseNumber(this)
            ];
        } else if (cmd === "Z") {
            this._skipOptionalSpaces();
            values = [];
        }

        if (values === null || values.indexOf(null) >= 0) {
            // Unknown command or known command with invalid values
            return null;
        } else {
            return { type: command, values };
        }          
    }


    hasMoreData(): boolean {
        return this._currentIndex < this._endIndex;
    }

    peekSegmentType(): string {
        var char = this._string[this._currentIndex];
        return COMMAND_MAP[char] ? COMMAND_MAP[char] : null;
    }


    initialCommandIsMoveTo(): boolean {
        // If the path is empty it is still valid, so return true.
        if (!this.hasMoreData()) {
            return true;
        }

        var command = this.peekSegmentType();
        // Path must start with moveTo.
        return command === "M" || command === "m";
    }


    _isCurrentSpace(): boolean {
        var char = this._string[this._currentIndex];
        return char <= " " && (char === " " || char === "\n" || char === "\t" || char === "\r" || char === "\f");
    }


    _skipOptionalSpaces(): boolean {
        while (this._currentIndex < this._endIndex && this._isCurrentSpace()) {
            this._currentIndex += 1;
        }

        return this._currentIndex < this._endIndex;
    }


    _skipOptionalSpacesOrDelimiter(): boolean {
        if (
            this._currentIndex < this._endIndex &&
            !this._isCurrentSpace() &&
            this._string[this._currentIndex] !== ","
        ) {
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


    _parseArcFlag(): number {
        if (this._currentIndex >= this._endIndex) {
            return null;
        }

        var flag = null;
        var flagChar = this._string[this._currentIndex];

        this._currentIndex += 1;

        if (flagChar === "0") {
            flag = 0;
        } else if (flagChar === "1") {
            flag = 1;
        } else {
            return null;
        }

        this._skipOptionalSpacesOrDelimiter();
        return flag;
    }
}


export { Source }
 