import * as esbuild from 'esbuild'
import { esbuildPluginIstanbul } from 'esbuild-plugin-istanbul'

const entry = 'src/index.ts'
const outdir = 'dist'
const globalName = 'BoardGameEngine'
const coverage = process.env.COVERAGE === '1'

const base = {
  entryPoints: [entry],
  bundle: true,
  platform: 'browser',
  target: ['es2020'],
}

if (coverage) {
  await esbuild.build({
    ...base,
    outfile: `${outdir}/board-game-engine.js`,
    format: 'iife',
    globalName,
    minify: false,
    plugins: [
      esbuildPluginIstanbul({
        name: 'istanbul',
        filter: /\.(js|ts)$/,
        include: ['src/**/*.{js,ts}'],
        exclude: ['**/*.spec.js', '**/node_modules/**'],
      }),
    ],
  })
  console.log('Built instrumented bundle:', `${outdir}/board-game-engine.js`)
  process.exit(0)
}

await Promise.all([
  esbuild.build({ ...base, outfile: `${outdir}/board-game-engine.cjs`, format: 'cjs' }),
  esbuild.build({ ...base, outfile: `${outdir}/board-game-engine.mjs`, format: 'esm' }),
  esbuild.build({ ...base, outfile: `${outdir}/board-game-engine.js`, format: 'iife', globalName, minify: false }),
  esbuild.build({ ...base, outfile: `${outdir}/board-game-engine.min.js`, format: 'iife', globalName, minify: true }),
])

console.log('Built:', `${outdir}/board-game-engine.cjs`, `${outdir}/board-game-engine.mjs`, `${outdir}/board-game-engine.js`, `${outdir}/board-game-engine.min.js`)
