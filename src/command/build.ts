import { CAC } from "cac";
import ts from 'typescript'
import { rollup } from 'rollup'
import { rimraf } from 'rimraf'
import { posix } from "path";
import { pathToFileURL } from "url";

export function appendBuild(cac: CAC) {
  cac
    .command('build', `build project`)
    .action(async () => {
      const configFilePath = ts.findConfigFile('', ts.sys.fileExists, 'tsconfig.json')
      if (!configFilePath) { throw new Error(`can't find a tsconfig.json`) }
      const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(configFilePath, {
        module: ts.ModuleKind.ESNext,
      }, {
        ...ts.sys,
        onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
          throw new Error(diagnostic.messageText.toString())
        }
      })
      if (!parsedCommandLine) { throw new Error() }
      if (parsedCommandLine.errors.length !== 0) {
        throw new Error(parsedCommandLine.errors.map((e) => e.messageText.toString()).join('\n\n'))
      }
      const { program, buildStart } = (() => {
        const program = ts.createProgram({
          rootNames: parsedCommandLine.fileNames,
          options: {
            ...parsedCommandLine.options,
            noEmit: false,
          },
        })

        return {
          program,
          buildStart: async () => {
            await rimraf(program.getCompilerOptions().outDir ?? './dist')
            program.emit(undefined, undefined, undefined, true)
          },
        }
      })()

      const srcPath = pathToFileURL(`${parsedCommandLine.options.rootDir}/`) ?? new URL('./src/', import.meta.url)

      const build = await rollup({
        input: Object.fromEntries(program.getRootFileNames()
          .filter((str) => !str.endsWith('.d.ts'))
          .map((path) => {
            const outputName = posix.relative(srcPath.pathname, pathToFileURL(path).pathname)
              .replace(/.ts$/, '')
              .replace(/.tsx$/, '')
              .replace(/.msx$/, '')
            return [outputName, path]
          })
        ),
        plugins: [
          {
            name: 'tss-build',
            buildStart,
            resolveId: function (id, importer) {
              if (!importer) { return null }
              const { resolvedModule } = ts.resolveModuleName(id, importer, parsedCommandLine.options, ts.sys)
              if (resolvedModule && !resolvedModule.isExternalLibraryImport) {
                const resultId = posix.relative(
                  new URL('.', pathToFileURL(importer)).pathname,
                  new URL(pathToFileURL(resolvedModule.resolvedFileName)).pathname,
                ).replace(new RegExp(`${resolvedModule.extension.replaceAll('.', '\\.')}$`), '.js')
                return {
                  external: true,
                  id: resultId.startsWith('.') ? resultId : `./${resultId}`,
                }
              }
              return { id, external: true }
            },
            load: function (id) {
              const transplieOutput = ts.transpileModule(ts.sys.readFile(id) ?? '', {
                compilerOptions: parsedCommandLine.options,
              })
              return transplieOutput.outputText
            }
          }
        ]
      })
      await build.write({
        dir: program.getCompilerOptions().outDir ?? './dist',
      })
    })
}