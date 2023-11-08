import * as esbuild from "esbuild";

const options = {
  entryPoints: [
    "bw.ts",
    "adSpotPreview.ts",
    "metaContentSpotPreview.ts",
    "tippyExample.ts",
  ],
  bundle: true,
  outdir: "dist",
  sourcemap: true,
  minify: false,
  define: {
    BW_DASHBOARD_BASE_URL: '"http://192.168.86.212:3000"',
    BW_CDN_BASE_URL: '"http://192.168.86.212:8000"',
    BW_FEEDBACK_URL: '"https://brandweaver.ai/what-is-brandweaver-content-dev"',
    BW_ENV: '"development"'
  },
};

let ctx = await esbuild.context(options);

await ctx.watch();

let { host, port } = await ctx.serve({
  port: 8000,
  host: "0.0.0.0",
  servedir: "./dist",
  // certfile: './server.crt',
  // keyfile: './server.key'
});

console.log(`server has file(s) at http(s)://server:${port}/bw.js`);
