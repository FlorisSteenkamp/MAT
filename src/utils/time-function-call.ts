import { sum } from './sum.js';


type TimedFunction<T extends (...args: any[]) => any> =
    ((this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>) & {
        getStats: () => {
            count: number;
            totalMs: number;
            avg: number;
            // history: number[];
        };

        resetStats: () => void;
    };


/**
 * 
 * @param f 
 */
function timeFunctionCalls<T extends (...args: any[]) => any>(f: T): TimedFunction<T> {
    const history: number[] = [];

    function wrapper(this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
        const start = performance.now();
        const result = f.apply(this, args); // Execute original function
        const end = performance.now();
        
        history.push(end - start); // Track the duration

        return result;
    };

    // Attach a helper method to inspect stats at any time
    wrapper.getStats = () => {
        const total = sum(history);
        return {
            totalMs: total,
            count: history.length,
            avg: history.length === 0 ? 0 : total / history.length,
            // history: history
        };
    };

    wrapper.resetStats = () => {
        history.length = 0;
    }

    return wrapper as TimedFunction<T>;
}


export { timeFunctionCalls }
