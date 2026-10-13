import type { Loop } from 'flo-boolean';
/**
 * @internal
 * Resets the generated debug `_debug_.elems` (if debug is enabled) so that
 * they only reflect the current `findMats` call.
 */
declare function resetDebugElems(): void;
/**
 * @internal
 * Adds (if debug is enabled) the loose and tight bounding boxes, the bounding
 * hulls and the sharp and dull corners of the given loops' curves to
 * `_debug_.elems` for later inspection by consumers.
 */
declare function addDebugElems(loops: Loop[]): void;
declare function addDebugInfo1(): void;
/** @internal */
declare function addDebugInfo2(): void;
/** @internal */
declare function addDebugInfo3(): void;
/** @internal */
declare function addDebugInfo4(): void;
export { resetDebugElems, addDebugElems, addDebugInfo1, addDebugInfo2, addDebugInfo3, addDebugInfo4 };
