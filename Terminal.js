class Terminal {
    constructor(editor) {
        this._editor = editor;
        this._domNode = this._editor.getDomNode();
        this._lines_to_add = [];
    }
    
    clear() {
        this._lines_to_add = [];
        this._editor.setValue("");
    }
    
    append(line) {
        line = line.replace(/\x1B\[([0-9;]*m|A)/g, "");
        this._lines_to_add.push(line);
        this._raf_id = this._raf_id || requestAnimationFrame(() => {
            this._raf_id = null;
            if (this._lines_to_add.length === 0) return;
            const to_add = this._lines_to_add.splice(0).join("\n");
            const shouldScroll = this._isScrollAtBottom();
            const value = this._editor.getValue();
            if (value !== "") {
                this._editor.setValue(value + "\n" + to_add);
            } else {
                this._editor.setValue(to_add);
            }
            if (shouldScroll) {
                this._editor.setScrollTop(this._editor.getScrollHeight());
            }
        });
    }
    
    _isScrollAtBottom() {
        const scrollBottom = this._editor.getScrollTop() + this._domNode.clientHeight;
        const scrollHeight = this._editor.getScrollHeight();
        return scrollBottom > scrollHeight - 10;
    }
}
