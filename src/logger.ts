let log = "";

const addToLog = (entryType: string, entry: string) => {
    log = log + `[${entryType}]: ${entry}`;
    console.log(log);
};

export { addToLog, log };
