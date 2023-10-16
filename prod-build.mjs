import * as esbuild from 'esbuild'

const options = {
  entryPoints: ['bw.ts', 'adSpotPreview.ts', 'metaContentSpotPreview.ts'],
  bundle: true,
  outdir: './dist',
  sourcemap: true,
  minify: true,
  define: {
    'BW_DASHBOARD_BASE_URL': '"https://app.brandweaver.ai"',
    'BW_CDN_BASE_URL': '"https://cdn.brandweaver.ai"',
    'BW_FEEDBACK_URL': '"https://brandweaver.ai/what-is-brandweaver-content"'
  },
};

let buildResult = await esbuild.build(options);
console.log("buildResult:" , buildResult);