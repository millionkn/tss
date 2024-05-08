import { hooks, service } from "./const.js"
import { fileURLToPath, pathToFileURL } from 'url'

export const load: (Extract<typeof hooks, { load: any }>)['load'] = async (specifier, ctx, load) => {
  if (specifier.endsWith('.ts') || specifier.endsWith('.mts') || specifier.endsWith('.tsx')) {
    const result = await load(specifier, { format: 'module' }, load)
    const outputText = service.ts.transpileModule(result.source?.toString() ?? '', {
      fileName: specifier,
      compilerOptions: {
        ...service.config.options,
        sourceMap: false,
        inlineSourceMap: true,
        inlineSources: false,
      },
    }).outputText
    return {
      ...result,
      source: outputText,
    }
  }
  return load(specifier, ctx, load)
}

export const resolve: typeof hooks['resolve'] = async (specifier, ctx, resolve) => {
  if (!ctx.parentURL) {
    return hooks.resolve(specifier, ctx, resolve)
  }
  const { resolvedModule } = service.ts.resolveModuleName(specifier, fileURLToPath(new URL(ctx.parentURL)), service.config.options, service.ts.sys)
  if (!resolvedModule || resolvedModule.isExternalLibraryImport) { return resolve(specifier, ctx, resolve) }
  return hooks.resolve(pathToFileURL(resolvedModule.resolvedFileName).href, ctx, resolve)
}