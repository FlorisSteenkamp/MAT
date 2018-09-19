declare function pairSet_add<T>(map: Map<T, Set<T>>, vs: T[]): void;
declare function pairSet_has<T>(map: Map<T, Set<T>>, vs: T[]): boolean;
export { pairSet_add, pairSet_has };
