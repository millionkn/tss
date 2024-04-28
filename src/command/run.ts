import { CAC } from "cac";
import { existsSync } from 'fs'
import { config } from 'dotenv'
import { execSync } from 'child_process'
import { env } from 'process'
import { resolve } from 'path'
import { pathToFileURL } from "url";

export function appendRun(cac: CAC) {
  cac
    .command('run <target>', `run <target> file with ts-node`)
    .option('--mode [mode]', `will load '.env.[mode]' and '.env.[mode].local',default is 'development'`)
    .option('--watch', `run node with '--watch' flag`)
    .option('--inspect', `run node with '--inspect' flag`)
    .action(async (target: string, options: {
      mode: string | undefined,
      watch: boolean | undefined,
      inspect: boolean | undefined,
    }) => {
      const mode = options.mode || 'development'
      const output = config({
        override: true,
        path: [`.env`, `.env.local`, `.env.${mode}`, `.env.${mode}.local`].filter((str) => existsSync(str))
      })
      execSync([
        `node`,
        `${!options.watch ? '' : '--watch'}`,
        `${!options.inspect ? '' : '--inspect'}`,
        `--import ${pathToFileURL(resolve(import.meta.dirname, '../register.js')).href}`,
        target,
      ].filter((e) => !!e).join(' '), {
        stdio: 'inherit',
        env: {
          ...env,
          ...output.parsed ?? {},
        }
      })
    })
}