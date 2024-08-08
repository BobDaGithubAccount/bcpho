emcc src/fluid_simulator.cpp -o src/fluid_simulator.js \
-s MODULARIZE=1 \
-s EXPORT_NAME="createModule" \
-s ENVIRONMENT=web \
-s EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] \
--bind