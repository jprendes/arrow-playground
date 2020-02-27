class Arrow extends Evented {
    constructor() {
        super();
        
        this._worker = new Worker("arrow.worker.js");
        this._events = new Evented(this._worker);
        
        this._events.on("print", line => {
            this._valid && this.emit("print", line);
        });
        this._events.on("printErr", line => {
            this._valid && this.emit("printErr", line);
        });
        this._valid = true;
        this._running = false;
        
        this.on("start", () => this._running = true);
        this.on("stop", () => this._running = false);
    }
    
    destroy() {
        if (this.running()) {
            this._valid && this.emit("stop");
        }
        this._valid = false;
        this._worker.terminate();
    }
    
    running() {
        return this._running;
    }
    
    eval(prog, args) {
        let current_job = this._job;
        this._job = new Promise(async resolve => {
            await current_job;
            try {
                const done_evt = this._events.on("done", () => {
                    done_evt.remove();
                    this._valid && this.emit("stop");
                    resolve();
                });
                this._valid &&  this.emit("start");
                this._events.emit("eval", {prog, args});
            } catch (err) {
                this._valid && this.emit("printErr", err.stack || err.message);
                this._valid && this.running() && this.emit("stop");
            }
        });
        return this._job;
    }
}