import ts from 'typescript'
import { rm } from 'fs'




console.log(!!rm)

const configFilePath = ts.findConfigFile('', ts.sys.fileExists, 'tsconfig2.json')
if (!configFilePath) { throw new Error(`can't find a tsconfig.json`) }

const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(configFilePath, {}, {
  ...ts.sys,
  onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
    throw new Error(diagnostic.messageText.toString())
  }
})
if (!parsedCommandLine) { throw new Error() }
if (parsedCommandLine.errors.length !== 0) {
  throw new Error(parsedCommandLine.errors.map((e) => e.messageText.toString()).join('\n\n'))
}
const program = ts.createProgram({
  options: parsedCommandLine.options,
  rootNames: parsedCommandLine.fileNames,
})

program.emit()

