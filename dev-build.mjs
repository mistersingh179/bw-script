import * as esbuild from 'esbuild'

const options = {
  entryPoints: ['bw.ts'],
  bundle: true,
  outdir: 'dist',
  sourcemap: true,
  minify: false,
};

let ctx = await esbuild.context(options);

await ctx.watch()

let { host, port } = await ctx.serve({
  port: 8000,
  host: '0.0.0.0',
  servedir: './dist'
})

console.log("esbuild server is listening at: ", host, port)