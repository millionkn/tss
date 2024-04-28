import { CAC } from "cac";
import { build } from 'vite';
import { service } from "../const.js";
import { fileURLToPath, pathToFileURL } from "url";
import dts from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export function appendBuild(cac: CAC) {
  cac
    .command('build <target>', `build project`)
    .action(async (target: string, options: {
      mode: string | undefined,
    }) => {
      const mode = options.mode || 'production'
      await build({
        plugins: [
          nodePolyfills(),
          service.config.options.declaration && dts({ compilerOptions: service.config.options }),
        ],
        envFile: false,
        mode,
        build: {
          lib: {
            formats: ['es'],
            entry: target,
          },
          minify: false,
          rollupOptions: {
            external: (source, importer) => {
              if (!importer) { return false }
              const { resolvedModule } = service.ts.resolveModuleName(source, fileURLToPath(new URL(pathToFileURL(importer))), service.config.options, service.ts.sys)
              if (!resolvedModule) { return true }
              return resolvedModule.isExternalLibraryImport
            }
          },
        }
      })
    })
}