cd fluid_simulator
pwd
rm -r pkg
wasm-pack build --target web
cp -r pkg/* ../src/