import { CAC } from "cac";
// import { build } from 'vite';
// import { service } from "../const.js";
// import { fileURLToPath, pathToFileURL } from "url";
// import dts from 'vite-plugin-dts';
// import { nodePolyfills } from 'vite-plugin-node-polyfills'

export function appendBuild(cac: CAC) {
  // cac
  //   .command('build <target>', `build project`)
  //   .action(async (target: string, options: {
  //     mode: string | undefined,
  //   }) => {
  //     const mode = options.mode || 'production'
  //     const configFile = service.ts.findConfigFile('', service.ts.sys.fileExists)
  //     if (!configFile) {
  //       throw new Error(`can't find 'tsconfig.json'`)
  //     }
  //     const readResult = service.ts.readConfigFile(configFile, service.ts.sys.readFile)
  //     if (!readResult.config) {
  //       console.error(readResult.error?.messageText)
  //       throw new Error()
  //     }
  //     await build({
  //       plugins: [
  //         readResult.config.compilerOptions.declaration && dts(),
  //         nodePolyfills(),
  //         {
  //           name: 'ts-resolver',
  //           config: () => {
  //             return {
  //               build: {
  //                 rollupOptions: {
  //                   external: (source, importer) => {
  //                     if (!importer) { return false }
  //                     const { resolvedModule } = service.ts.resolveModuleName(source, fileURLToPath(new URL(pathToFileURL(importer))), service.config.options, service.ts.sys)
  //                     if (!resolvedModule) { return true }
  //                     return resolvedModule.isExternalLibraryImport
  //                   }
  //                 }
  //               },
  //             }
  //           },
  //           resolveId: function (source, importer) {
  //             if (!importer) { return }
  //             const url = pathToFileURL(importer)
  //             const path = fileURLToPath(url)
  //             const { resolvedModule } = service.ts.resolveModuleName(source, path, service.config.options, service.ts.sys)
  //             if (!resolvedModule) { return }
  //             if (resolvedModule.isExternalLibraryImport) { return }
  //             return {
  //               id: resolvedModule.resolvedFileName,
  //               external: false,
  //             }
  //           }
  //         },
  //       ],
  //       envFile: false,
  //       mode,
  //       build: {
  //         lib: {
  //           formats: ['es'],
  //           entry: { index: target },
  //         },
  //         minify: false,
  //       }
  //     })
  //   })
}