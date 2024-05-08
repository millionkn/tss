import { cac as createCAC } from 'cac'
import { appendRun } from './command/run.js'
import { appendBuild } from './command/build.js'
import { exit } from 'process'

const cac = createCAC('tss')
appendRun(cac)
appendBuild(cac)
cac.command('').action(() => {
  cac.outputHelp()
  exit(1)
})
cac.help().parse()