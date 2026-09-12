import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    arrowParens: 'always',
    experimentalSortImports: {
      ignoreCase: true,
      newlinesBetween: true,
      order: 'asc',
    },
    experimentalSortPackageJson: true,
    jsxSingleQuote: true,
    printWidth: 120,
    proseWrap: 'preserve',
    semi: false,
    singleQuote: true,
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  test: { include: ['src/**/*.test.ts'] },
  pack: { entry: ['src/index.ts'], format: ['esm'], platform: 'neutral', dts: true, clean: true },
  run: {
    tasks: {
      ci: {
        command: 'vp check && vp test run && vp pack && npm pack --dry-run',
        cache: false,
      },
      fix: {
        command: 'vp check --fix',
        cache: false,
      },
    },
  },
})
