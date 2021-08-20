require('esbuild').buildSync({
  entryPoints: ['src/index.ts'],
  format: "cjs",
  minify: false,
  loader: {
    ".ts": "ts"
  },
  outdir: "dist",
  // external: [
  //   "@vitejs/plugin-vue",
  //   "@vue/compiler-sfc"
  // ],
  tsconfig: 'tsconfig.json'
})