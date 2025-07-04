import { register } from "module";
import sms from 'source-map-support'
import { service } from "./const.js";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import ts from "typescript";

export const transpileResultCache: { [path: string]: string } = {}

sms.install({
	retrieveFile: (path) => {
		if (path in transpileResultCache) { return transpileResultCache[path] }
		if (!path.startsWith('file:///')) { return null }
		if (path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.mts')) {
			const outputText = service.ts.transpileModule(readFileSync(fileURLToPath(new URL(path))).toString(), {
				fileName: path,
				compilerOptions: {
					...service.config.options,
					module: ts.ModuleKind.ESNext,
					inlineSourceMap: true,
					inlineSources: false,
				},
			}).outputText
			return outputText
		}
		return null
	},
})


register('./loader.js', import.meta.url)