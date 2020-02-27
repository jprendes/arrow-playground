const examples = [
    ["argtest", "examples/argtest.ar", "\"hello!\""],
    ["binary", "examples/binary.ar", "42"],
    ["eightQueens", "examples/eightQueens.ar", "8"],
    ["factorial", "examples/factorial.ar", "5", true],
    ["fib", "examples/fib.ar", ""],
    //["gen", "examples/gen.ar", ""],
    //["gen2", "examples/gen2.ar", ""],
    ["lists", "examples/lists.ar", ""],
    //["macroLike", "examples/macroLike.ar", ""],
    ["mandelbrot", "examples/mandelbrot.ar", ""],
    ["reverse", "examples/reverse.ar", ""],
    ["wildcard_match", "examples/wildcard_match.ar", ""],
].map(([name, url, args, selected]) => {
    const prog = fetch(url).then(res => res.text());
    return { name, prog, args, selected };
});