require('esbuild').buildSync({
  entryPoints: ['src/index.ts'],
  platform: "node",
  target: "node12",
  format: "cjs",
  minify: false,
  loader: {
    ".ts": "ts"
  },
  bundle: true,
  external: [
    "@vitejs/plugin-vue"
  ],
  outdir: "dist",
  tsconfig: 'tsconfig.json'
})