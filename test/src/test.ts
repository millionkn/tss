import ts from 'typescript'

const configFilePath = ts.findConfigFile('./', ts.sys.fileExists)
if (!configFilePath) { throw new Error(`can't find a tsconfig.json`) }

const configFile = ts.readConfigFile(configFilePath, ts.sys.readFile)
if (configFile.error) {
  throw new Error(configFile.error.messageText.toString())
}
const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(configFilePath, {}, {
  ...ts.sys,
  onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
    console.log(diagnostic.messageText)
  }
})
if (!parsedCommandLine) { throw new Error() }

const program = ts.createProgram({
  options: parsedCommandLine.options,
  rootNames: parsedCommandLine.fileNames,
})

program.emit()

