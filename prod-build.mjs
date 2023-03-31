import * as esbuild from 'esbuild'

const options = {
  entryPoints: ['bw.ts'],
  bundle: true,
  outdir: './dist',
  sourcemap: true,
  minify: true,
  define: {
    'BW_DASHBOARD_BASE_URL': '"https://app.brandweaver.ai"',
  },
};

let buildResult = await esbuild.build(options);
console.log("buildResult:" , buildResult);