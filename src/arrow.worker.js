importScripts("Evented.js");
importScripts("arrow.js");

WasmArrow.create = (opts) => {
    return new Promise(resolve => {
        const module = new WasmArrow(Object.assign({}, opts, {
            postRun: (...args) => {
                opts.postRun && opts.postRun(...args);
                delete module.then;
                resolve(module);
            }
        }));
    });
};

const events = new Evented(self);

const arrow_promise = WasmArrow.create({
    print: line => events.emit("print", line),
    printErr: line => events.emit("printErr", line),
});

events.on("eval", async ({prog, args}) => {
    const arrow = await arrow_promise;
    arrow.ccall("eval", null, ["string", "string"], [prog, args]);
    events.emit("done");
});
