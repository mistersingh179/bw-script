import * as esbuild from 'esbuild'

const options = {
  entryPoints: ['bw.ts'],
  bundle: true,
  outdir: './dist',
  sourcemap: true,
  minify: true,
};

let buildResult = await esbuild.build(options);
console.log("buildResult:" , buildResult);