# template-vite-plus-lib initialization

## Template files

| File                                     | Meaning                                                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `README.md`                              | AI initialization entry point.                                                                      |
| `AGENTS.md`                              | Template file map and initialization steps, replaced during initialization.                         |
| `README_TEMPLATE.md`                     | Consumer library README to customize and promote to README.md.                                      |
| `AGENTS_TEMPLATE.md`                     | Developer guidance to customize and promote to AGENTS.md.                                           |
| `src/index.ts`                           | Public library exports.                                                                             |
| `src/greet.ts`                           | Sample library function to replace.                                                                 |
| `src/greet.test.ts`                      | Tests through the public library entry point.                                                       |
| `package.json`                           | Private-by-default package identity, ESM exports, declarations, dependencies, and package contents. |
| `pnpm-lock.yaml`                         | Sole dependency lock for pnpm.                                                                      |
| `pnpm-workspace.yaml`                    | pnpm installation policy, including the 24-hour release-age requirement.                            |
| `vite.config.ts`                         | Vite+ formatter, linter, tests, declaration packaging, and aggregate tasks.                         |
| `tsconfig.json`                          | Strictest and node-ts presets with minimal library source-checking overrides.                       |
| `flake.nix`                              | Development shell with nixfmt and an externally bootstrapped Vite+ Git hook.                        |
| `flake.lock`                             | Pinned Nix inputs.                                                                                  |
| `.envrc`                                 | Optional direnv entry point.                                                                        |
| `.github/workflows/ci.yml`               | Pre-merge checks, tests, and library packaging.                                                     |
| `.github/workflows/publish.yml.disabled` | Disabled repository-linked npm OIDC publication.                                                    |
| `.gitignore`                             | Local dependencies, generated output, archives, and temporary files excluded from Git.              |
| `LICENSE`                                | License and copyright holder to review.                                                             |

## Initialization

### CI and publication policy

Keep the template's CI and publication workflows unchanged by default when creating a project.
In particular, do not replace publication on pushes to `main` with tag or release triggers.
Preserve existing tag triggers where the template already uses them.
Change workflows only for an explicit user request or a demonstrated project requirement, and explain why the change is necessary.
Project metadata replacement and the optional publication setup below are permitted, but do not justify unrelated CI changes.
Retain this policy in the generated project's `AGENTS.md`.

### 1. Establish the project and environment

Work from the copied repository root.
Use the user's intended repository, package name, purpose, license, and publication target.
Ask for missing registry ownership decisions rather than inventing credentials or publishing permissions.
Bootstrap Node.js 24, pnpm at the version in `packageManager`, and Vite+ on `PATH` before entering `nix develop`, then run `vp install --frozen-lockfile`.
Review `.envrc` before explicitly allowing direnv.
The Nix shell supplies only nixfmt and runs the externally available `vp config` to enable Git hooks.
Node.js, pnpm, and Vite+ are supplied externally, or by the shared TypeScript setup in CI, not by this library's Nix shell.
Preserve this library's nixfmt-only provisioning policy and leave unrelated Bun CLIs unmanaged.
The disabled publication workflow retains its original setup order and triggers. Review hook bootstrap before enabling it.
CI uses `setup-typescript@main` before `setup-nix@main` so Vite+ is available before Nix shell hooks run. The TypeScript setup selects pnpm through `packageManager`, and verification loads the shell with `eval "$(nix print-dev-env "$GITHUB_WORKSPACE#default")"`.
Keep all `totto2727-org/monorepo` action references on `@main`.

### 2. Replace the library and metadata

Replace the name, version, description, repository URL, and license in `package.json`, the flake description, and the license holder.
Replace the greeting implementation and tests with the requested library.
Keep public exports in `src/index.ts`, and align `exports`, `types`, and `files` with the generated files.
Keep `private: true` until the user explicitly configures publication.
Retain Vite+ for both formatting and linting, with all existing formatter settings including `semi: false`, single quotes, print width 120, and preserved Markdown wrapping.
Do not add `CLAUDE.md`, `package.nix`, Nix package/CLI overlay outputs, CLI entry points, or Nix build CI.

Use `vp pack` to build the library with `pack.dts: true`, or `vp run build` for the cache-aware task.
The [official build guide](https://viteplus.dev/guide/build) says `vp build` always invokes Vite's production build, even when a build script exists.
The [official pack guide](https://viteplus.dev/guide/pack) specifies `vp pack` for libraries and built-in declaration generation.
Vite library mode can bundle JavaScript through `vp build`, but declarations require additional tooling.
This template deliberately uses the smaller native `vp pack` configuration instead of a declaration plugin or custom build hook.

### 3. Create the project's documentation

Customize `README_TEMPLATE.md` around consumer usage, prerequisites, dependency installation, and every public export.
Use `vp add` with the configured package name for registry installation, assuming the package will be published.
Do not add a CLI installation matrix or developer build commands to the consumer README.
Customize `AGENTS_TEMPLATE.md` around the actual paths, tasks, library boundaries, and publication constraints.
Remove obsolete placeholder content and initialization guidance from the final project documents.
Replace `README.md` and `AGENTS.md` with the customized `README_TEMPLATE.md` and `AGENTS_TEMPLATE.md`, then remove the two `_TEMPLATE.md` files.
Keep their share-artifact provenance footers.

### 4. Configure optional npm publication

Keep `.github/workflows/publish.yml.disabled` disabled until the package owner completes registry linking.
Keep `private: true` unless npm publication is explicitly wanted.

1. Set the real package name, version, and repository URL, and ensure the npm package exists under an account or organization the user controls. If npm requires an initial authenticated publication before trusted-publisher settings exist, the package owner must perform it manually.
2. Configure the package's npm Trusted Publisher with the exact GitHub owner, repository, and workflow filename `publish.yml`. Enable direct publication, not staged-only publishing. If an npm trusted-publisher environment is configured, add the matching protected environment to the workflow job.
3. Review the [npm trusted publishing requirements](https://docs.npmjs.com/trusted-publishers/) and current shared [publish-npm action](https://github.com/totto2727-org/monorepo/blob/main/.github/actions/publish-npm/action.yaml). It runs `vp pm stage publish -r --provenance` after filtering private packages and versions already on the registry. The external toolchain or shared TypeScript setup supplies pnpm. Keep job-scoped `id-token: write`, the GitHub-hosted runner, and `working-directory: .`. Do not add long-lived npm tokens.
4. Review third-party action pins and protect release tags. Remove `private: true` only when ready, then rename `publish.yml.disabled` to `publish.yml`. Delete the disabled workflow instead if publication is not wanted.
5. Run pre-merge validation and review a real packed consumer before tagging. Push a protected `v<version>` tag that matches `package.json` only from a validated commit. The workflow installs locked dependencies, runs `vp pack`, and calls `totto2727-org/monorepo/.github/actions/publish-npm@main`. Do not duplicate CI checks, tests, or dry runs in the publish workflow. Use a new version for changed contents.

### 5. Validate and hand off

Run `vp run fix` and `vp run ci`.
The aggregate task runs `check`, `test`, and `build` concurrently.
All tasks, including `fix`, use Vite+ default caching.
The build task excludes `dist/**` from automatic inputs and restores `dist/**` outputs on cache hits.
Keep `dist/` ignored by the formatter and linter.
TypeScript uses default file discovery, which can include built declarations.
Use `vp run --no-cache ci` when a fresh execution is needed.
No task starts an application or builds a Nix package.
Inspect `dist/index.js` and `dist/index.d.ts`, then run `vp pm pack --pack-destination tmp` after creating `tmp/`.
Install that archive into an isolated consumer under `tmp/`, compile an ESM TypeScript import by package name with strict NodeNext resolution, and execute the exported function.
Check positive return types and rejected invalid arguments, not just declaration-file existence.
Keep temporary consumers and archives under ignored `tmp/` and out of commits.
Remove temporary TypeScript consumers before whole-project checks, because TypeScript discovery does not honor `.gitignore`.
Use pnpm as the only package manager and update `pnpm-lock.yaml` with `vp install` when dependencies change.
Keep the external pnpm toolchain aligned with `packageManager`.
Keep `pnpm-workspace.yaml`'s `minimumReleaseAge: 1440` and `minimumReleaseAgeStrict: true` for new direct and transitive resolutions, with no exclusions.
See [pnpm dependency policy](https://pnpm.io/settings#minimumreleaseage).
Keep the exact Vite+ 1.1.0 catalog entry and official `vite@*` alias and bundled `vitest@*` 5.0.3 overrides in `pnpm-workspace.yaml`. Preserve caret ranges on the other dependencies and deny Vite+ lifecycle scripts through `allowBuilds`.
When updating Vite+, match the `vite` alias to the installed `vite-plus` version and the `vitest` override to `vp toolchain vitest`.
Update `flake.lock` only when Nix inputs change.
Validate both the active CI workflow and disabled publication file with actionlint without enabling publication.
Review final documents for obsolete placeholders and links before committing.
