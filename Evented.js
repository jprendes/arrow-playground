class Evented {
    constructor(env = {
        postMessage: function (data) {
            this.onmessage && this.onmessage({data});
        }
    }) {
        this._env = env;
        this._events = {};
        
        this._idx_in = 0;
        this._idx_out = 0;
        this._queue = {};
        
        this._env.onmessage = evt => {
            const {type, payload, idx} = evt.data;
            this._queue[idx] = {type, payload};
            this._emit_queue();
        };
    }
    
    emit(type, payload) {
        const idx = this._inc_out();
        this._env.postMessage({type, payload, idx});
    }
    on(type, fcn) {
        const fcn_ = (...args) => fcn(...args);
        this._events[type] = this._events[type] || [];
        this._events[type].push(fcn_);
        return {remove: () => {
            this._events[type] = this._events[type].filter(f => f != fcn_);
        }};
    }
    
    _emit_queue() {
        while (this._queue[this._idx_in]) {
            const idx = this._inc_in();
            const {type, payload} = this._queue[idx];
            delete this._queue[idx];                
            if (this._events[type]) {
                for (const fcn of this._events[type]) {
                    try {
                        fcn(payload);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        }
    }
    
    _inc_in() {
        const idx = this._idx_in++;
        if (this._idx_in === Number.MAX_SAFE_INTEGER) {
            this._idx_in = 0;
        }
        return idx;
    }
    
    _inc_out() {
        const idx = this._idx_out++;
        if (this._idx_out === Number.MAX_SAFE_INTEGER) {
            this._idx_out = 0;
        }
        return idx;
    }
}
