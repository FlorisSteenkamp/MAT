type TimedFunction<T extends (...args: any[]) => any> = ((this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>) & {
    getStats: () => {
        count: number;
        totalMs: number;
        avg: number;
    };
    resetStats: () => void;
};
/**
 *
 * @param f
 */
declare function timeFunctionCalls<T extends (...args: any[]) => any>(f: T): TimedFunction<T>;
export { timeFunctionCalls };
