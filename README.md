# arrow-playground
Arrow playground using WebAssembly and the Monaco editor.

## About
This is a playground for the [Arrow](https://github.com/benhj/arrow) programming language.
> Arrow is a weakly typed interpreted programming language with a primary aim of being a syntactic testbed in the design and implementation of an interpretor.

The playground runs the interpreter in the browser by compiling it to [WebAssembly](https://webassembly.github.io/). The editor is provided by the [Monaco Editor](https://microsoft.github.io/monaco-editor/).

## Build
Clone this repository, and run the `Makefile`.
```
$ git clone https://github.com/jprendes/arrow-playground.git
$ cd arrow-playground
$ make
```

This will create a `build` directory. Serve the content of that directory using a static web server (e.g., [node-static](https://www.npmjs.com/package/node-static)).
```
$ npm install -g node-static
$ cd build
$ static . &
$ xdg-open http://localhost:8080
```

Enjoy playing around with Arrow :-)