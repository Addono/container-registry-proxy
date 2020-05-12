import proxyServer from '../proxyServer'
import { loadPlugins, Plugin } from '../plugins'

export interface StartArguments {
  port: string
  registry: string
  http: string
  plugin: string[] | undefined
}

const printArguments = ({ port, registry, http, plugin }: StartArguments) => {
  const settingsFormatted: string = [
    ['PORT', port],
    ['REGISTRY_HOST', registry],
    ['HTTPS', !http],
    ['PLUGINS', plugin ?? []],
  ]
    .map(([key, value]) => ` - ${key}=${value}`)
    .reduce((a, b) => `${a}\n${b}`)

  console.log(`Configuration:\n${settingsFormatted}\n`)
}

const start = (args: StartArguments) => {
  // Print all received arguments
  printArguments(args)

  // Load all plugins
  const { port, registry, http, plugin: plugins = [] } = args
  const loadedPlugins: Plugin = loadPlugins(plugins)

  // Create the proxy server
  const server = proxyServer(loadedPlugins, { https: !http, port, registry })

  // Start the proxy server
  console.log('Starting server...\n')
  server.listen(port, () => console.log(`Server started on http://localhost:${port} 🚀\n`))
}

export default start
