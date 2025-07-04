import { CAC } from "cac";
import { existsSync } from 'fs'
import { config } from 'dotenv'
import { execaCommand } from 'execa'
import { env } from 'process'
import globWatch from 'glob-watcher'
import EventEmitter from "events";

import ansiEscapes from "ansi-escapes";
import colors from 'picocolors'
import dayjs from 'dayjs'

const format = (str: string, clear = true) => `${!clear ? '' : ansiEscapes.clearScreen}${colors.green(`[${dayjs().format('HH:mm:ss')}]`)} ${str}`

export function appendRun(cac: CAC) {
	cac
		.command('run <target>', `run <target> file with ts-node`)
		.option('--mode [mode]', `will load '.env.[mode]' and '.env.[mode].local',default is 'development'`)
		.option('--watch', `run in watch mode`)
		.option('--pass <str>', `pass <str> to node`, {
			type: [],
		})
		.action(async (target: string, options: {
			mode: string | undefined,
			watch: boolean | undefined,
			pass: string[] | undefined,
			'--': string[] | undefined,
		}) => {
			const mode = options.mode || 'development'
			const envFileArr = [`.env`, `.env.local`, `.env.${mode}`, `.env.${mode}.local`]
			const emitter = new EventEmitter({})
			let dispose = () => { }
			emitter.on('start', () => {
				console.log(format(`starting progrem...`, false))
				dispose()
				const child = execaCommand([
					`node`,
					options.pass?.join(' ') ?? '',
					`--import ${new URL('../register.js', import.meta.url).href}`,
					target,
					!options["--"] ? '' : `-- ${options["--"].join(' ')}`,
				].filter((e) => !!e).join(' '), {
					stdio: 'inherit',
					env: {
						...env,
						...config({
							override: true,
							path: envFileArr.filter((str) => existsSync(str)),
						}).parsed ?? {},
					}
				})
				child.catch(() => { }).finally(() => {
					console.log(format(`progrem has exit with code ${child.exitCode}`, false))
				})
				dispose = () => { child.kill() }
			})
			emitter.emit('start')
			emitter.on('restart', () => {
				dispose()
				const timeoutId = setTimeout(() => emitter.emit('start'), 400)
				dispose = () => clearTimeout(timeoutId)
			})
			if (options.watch) {
				const envFileWatcher = globWatch(envFileArr)
				envFileWatcher.on(`change`, (fileName) => {
					console.log(format(`env file ${colors.gray(fileName)} change,restart...`))
					emitter.emit('restart')
				})
				envFileWatcher.on(`add`, (fileName) => {
					console.log(format(`new env file ${colors.gray(fileName)},restart...`))
					emitter.emit('restart')
				})
				envFileWatcher.on(`unlink`, (fileName) => {
					console.log(format(`env file ${colors.gray(fileName)} removed,restart...`))
					emitter.emit('restart')
				})
				const srcFileWatcher = globWatch('src/**')
				srcFileWatcher.on('change', (fileName) => {
					console.log(format(`file ${colors.gray(fileName)} change,restart...`))
					emitter.emit('restart')
				})
				console.log(format(`watcher started`))
			}
		})
}