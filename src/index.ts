import { Plugin, loadPlugins } from './plugins'
import proxyServer from './proxyServer'

export const PORT: string = process.env?.PORT ?? '8080'
export const REGISTRY_HOST: string = process.env?.REGISTRY_HOST ?? 'registry.hub.docker.com'
export const HTTPS: boolean = process.env?.HTTPS?.toLowerCase() != 'false' ?? true

const settingsFormatted: string = [
  ['PORT', PORT],
  ['REGISTRY_HOST', REGISTRY_HOST],
  ['HTTPS', HTTPS],
]
  .map(([key, value]) => ` - ${key}=${value}`)
  .reduce((a, b) => `${a}\n${b}`)

console.log(`Configuration:\n${settingsFormatted}\n`)

const plugins: Plugin = loadPlugins()

const server = proxyServer(plugins)

console.log('Starting server...\n')

server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT} 🚀\n`))
