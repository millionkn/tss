import { CAC } from "cac";
import ts from 'typescript';

export function appendBuild(cac: CAC) {
  // cac
  //   .command('build', `build project`)
  //   .action(async () => {
  //     const configFilePath = ts.findConfigFile('./', ts.sys.fileExists)
  //     if (!configFilePath) { throw new Error(`can't find tsconfig.json`) }
  //     const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(configFilePath, {}, {
  //       ...ts.sys,
  //       onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
  //         console.log(diagnostic.messageText)
  //       }
  //     })
  //     if (!parsedCommandLine) { throw new Error() }
  //     const compilerHost = ts.createCompilerHost(parsedCommandLine.options)
  //     compilerHost.writeFile = (filename, text, writeByteOrderMark, onError, sourceFiles, data) => {

  //     }
  //     const program = ts.createProgram({
  //       options: parsedCommandLine.options,
  //       rootNames: parsedCommandLine.fileNames,
  //       host: {

  //       }
  //     })
  //   })
}