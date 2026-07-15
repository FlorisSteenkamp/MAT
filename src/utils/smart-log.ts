
let lastLog: any = null;
let logCount = 1;

/** For debugging only */
function smartLog(msg: any) {
    if (msg === lastLog) {
        logCount++;
        // Clears the previous line to prevent clutter, keeping only the latest count
        console.clear(); 
        console.log(`[${logCount}] ${msg}`);
    } else {
        logCount = 1;
        lastLog = msg;
        console.log(msg);
    }
}


export { smartLog }
