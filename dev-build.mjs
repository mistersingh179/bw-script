import * as esbuild from 'esbuild'

const options = {
  entryPoints: ['bw.ts'],
  bundle: true,
  outdir: 'dist',
  sourcemap: true,
  minify: false,
  define: {
    'BW_DASHBOARD_BASE_URL': '"http://localhost:3000"',
  },
};

let ctx = await esbuild.context(options);

await ctx.watch()

let { host, port } = await ctx.serve({
  port: 8000,
  host: '0.0.0.0',
  servedir: './dist',
  certfile: './server.crt',
  keyfile: './server.key'
})

console.log(`server has file at https://server:${port}/bw.js`)