import { pathToFileURL } from 'node:url'
import { resolve as resolvePath } from 'node:path'
import { existsSync } from 'node:fs'
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    let path = resolvePath('src', specifier.slice(2))
    if (!existsSync(path) && existsSync(path + '.js')) path += '.js'
    return nextResolve(pathToFileURL(path).href, context)
  }
  return nextResolve(specifier, context)
}
