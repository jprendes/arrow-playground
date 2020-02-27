// Register a new language
monaco.languages.register({ id: "Arrow" });

// Register a tokens provider for the language
monaco.languages.setMonarchTokensProvider("Arrow", {
    brackets: [
        ["{", "}", "delimiter.curly"],
        ["[", "]", "delimiter.square"],
        ["(", ")", "delimiter.parenthesis"],
    ],
    identifier: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
    tokenizer: {
        root: [
            [/\b(if|elseif|else|for|while|matches|in|start|break|return|exit|repeat|pod)\b/, "keyword.control.flow.$0"],
            [/->|\^\^|\^|==|\*|\/|\+|-|<|>|=|,|:|\|\||\?\?|\?|%/, "operator"],
            [/((?:^\s*)fn(?:\s*))(@identifier\b)/, ["keyword.fn", "entity.name.function"]],
            [/\b([0-9]+)((.[0-9]+)?)\b/, "constant.numeric"],
            [/\b(true|false)\b/, "constant.boolean"],
            [/\b(@identifier)\b\s*(?=\()/, "entity.name.function"],
            [/\b(@identifier)\b/, "variable"],
            [/\[/, "@brackets", "@list"],
            [/\]/, "invalid.illegal.stray-bracket-end"],
            [/\(/, "@brackets", "@brackets"],
            [/\)/, "invalid.illegal.stray-bracket-end"],
            [/\{/, "@brackets", "@curly"],
            [/\}/, "invalid.illegal.stray-bracket-end"],
            [/;;;/, "@rematch", "@comments"],
            [/;/, "punctuation"],
            [/"/, "string", "@string"],
            [/'/, "constant.char", "@char"],
            [/./, "invalid"],
        ],
        list: [
            [/\]/, "@brackets", "@pop"],
            { include: "@root" },
        ],
        brackets: [
            [/\)/, "@brackets", "@pop"],
            { include: "@root" },
        ],
        curly: [
            [/\}/, "@brackets", "@pop"],
            { include: "@root" },
        ],
        comments: [
            [/.*\\$/, "comment"],
            [/.*$/, "comment", "@pop"],
        ],
        string: [
            [/\\./, "string.escape"],
            [/"/, "string", "@pop"],
            [/[^\\"]*/, "string"]
        ],
        char: [
            [/\\./, "constant.char.escape"],
            [/'/, "constant.char", "@pop"],
            [/[^\\']/, "constant.char"]
        ],
    }
});