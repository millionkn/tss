import createCAC from 'cac'
import { appendRun } from './command/run.js'
import { appendBuild } from './command/build.js'

const cac = createCAC('tss')
appendRun(cac)
appendBuild(cac)
cac.help().parse()