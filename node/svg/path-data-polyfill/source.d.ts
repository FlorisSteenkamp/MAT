/** @hidden */
declare class Source {
    _string: string;
    _currentIndex: number;
    _endIndex: number;
    _prevCommand: string;
    constructor(string: string);
    parseSegment(): {
        type: string;
        values: number[];
    };
    hasMoreData(): boolean;
    peekSegmentType(): string;
    initialCommandIsMoveTo(): boolean;
    _isCurrentSpace(): boolean;
    _skipOptionalSpaces(): boolean;
    _skipOptionalSpacesOrDelimiter(): boolean;
    _parseArcFlag(): number;
}
export { Source };
