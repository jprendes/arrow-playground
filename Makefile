SHELL := /bin/bash

CACHE := ./cache
BUILD := ./build
ARROW := $(CACHE)/arrow/.done
EMSDK := $(CACHE)/emsdk/.done
EM := $(CACHE)/em

#    -s STANDALONE_WASM

CXX_FLAGS := -O3 -std=c++17 \
    -s DISABLE_EXCEPTION_CATCHING=0

LD_FLAGS := -O3 -std=c++17 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME="WasmArrow" \
    -s STRICT=1 \
    -s INVOKE_RUN=0 \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
    -s DISABLE_EXCEPTION_CATCHING=0 \
    -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' \
    -s ENVIRONMENT='web,worker'

SRC_PATH := $(dir $(ARROW))/src
OBJ_PATH := $(CACHE)/obj

SRC := $(shell find $(SRC_PATH) -name '*.cpp' 2> /dev/null)
OBJ := $(patsubst $(SRC_PATH)/%.cpp,$(OBJ_PATH)/%.o,$(SRC))

JS_SRC := $(shell find src/ -type f 2> /dev/null)

build : $(JS_SRC)
	make $(ARROW)
	make $(BUILD)/arrow.js
	cp $(JS_SRC) $(BUILD)/
	mkdir -p $(BUILD)/examples
	cp $(dir $(ARROW))/examples/* $(BUILD)/examples/

$(BUILD)/arrow.js : $(OBJ) $(ARROW) $(EM) Makefile
	mkdir -p $(dir $@)
	$(EM) em++ -o$(BUILD)/arrow.js \
	    $(LD_FLAGS) \
	    $(OBJ)

$(OBJ_PATH)/%.o : $(SRC_PATH)/%.cpp $(ARROW) $(EM)
	mkdir -p $(dir $@)
	$(EM) em++ -c -o$@ \
	    $(CXX_FLAGS) \
	    -I $(SRC_PATH) \
	    $<

$(SRC_PATH)/%.cpp : $(ARROW)

$(ARROW) : ./arrow.diff
	mkdir -p $(dir $@)
	rm -Rf $(dir $@)
	git clone --quiet https://github.com/benhj/arrow.git $(dir $@)
	git apply --directory="$(dir $@)" --whitespace=fix ./arrow.diff
	touch $@

$(EMSDK) :
	mkdir -p $(dir $@)
	git clone --quiet https://github.com/emscripten-core/emsdk.git $(dir $@)
	./cache/emsdk/emsdk update-tags
	./cache/emsdk/emsdk install latest-upstream
	./cache/emsdk/emsdk activate --embedded latest-upstream
	touch $@

$(EM) : $(EMSDK)
	echo '#!/bin/bash' > $@
	echo '' >> $@
	echo 'DIR="$$( cd "$$( dirname "$${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"' >> $@
	echo 'source "$$DIR/emsdk/emsdk_env.sh" "" > /dev/null' >> $@
	echo '"$$@"' >> $@
	chmod a+x $@

