// oxlint-disable-next-line rules/no-node-imports -- Vite+ loads this configuration in Node.js.
import { URL } from 'node:url'

import { generateIgnorePatterns } from '@totto2727/gitignore-patterns'
import libraryPreset from '@totto2727/oxlint/preset/library'
import { defineConfig } from 'vite-plus'

const ignorePatterns = await generateIgnorePatterns(new URL('.', import.meta.url))

// oxlint-disable-next-line import/no-default-export -- Vite+ loads the module default.
export default defineConfig({
  fmt: {
    arrowParens: 'always',
    experimentalSortImports: {
      ignoreCase: true,
      newlinesBetween: true,
      order: 'asc',
    },
    experimentalSortPackageJson: true,
    ignorePatterns,
    jsxSingleQuote: true,
    printWidth: 120,
    proseWrap: 'preserve',
    semi: false,
    singleQuote: true,
  },
  lint: {
    ...libraryPreset,
    ignorePatterns,
    options: { ...libraryPreset.options, typeCheck: true },
  },
  pack: { clean: true, dts: true, entry: { index: 'src/greet.ts' }, format: ['esm'], platform: 'neutral' },
  run: {
    tasks: {
      build: {
        cache: {
          input: [{ auto: true }, '!dist/**'],
          output: ['dist/**'],
        },
        command: 'vp pack',
      },
      check: {
        command: 'vp check',
      },
      ci: {
        command: '',
        dependsOn: ['check', 'test', 'build'],
      },
      fix: {
        command: 'vp check --fix',
      },
      test: {
        command: 'vp test run',
      },
    },
  },
  test: { dir: 'src' },
})
