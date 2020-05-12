import path from 'path'

export type Request = {
  host: string
  https: boolean
} & RelativeRequest

export type RelativeRequest = {
  version: string
  parameters?: {
    repository: string
    method: Method
    tag: string
  }
}

export enum Method {
  'manifests',
  'blobs',
}

export interface Plugin {
  name: string
  description?: string
  requestPipe: RequestPipe
}

type RequestPipe = (req: Request) => Promise<Request | undefined>

const identityPlugin: Plugin = {
  name: 'identity plugin',
  description: 'this plugin does not alter anything',
  requestPipe: async (req) => req,
}

/**
 * Chains the functionality of two plugins into one.
 */
const combinePlugins = (p1: Plugin, p2: Plugin): Plugin => ({
  name: `${p1.name}+${p2.name}`,
  requestPipe: async (req) => {
    const resultP1 = await p1.requestPipe(req)

    // Abort the pipe when one plugin requested to drop the request
    if (resultP1 === undefined) {
      return undefined
    }

    return p2.requestPipe(resultP1)
  },
})

export const loadPlugins: (pluginNames: string[], customPluginPaths: string[]) => Plugin = (
  pluginNames,
  customPluginPaths
) => {
  const pluginPaths = pluginNames
    .map((name) => `./plugins/${name}`)
    .concat(customPluginPaths.map((customPluginPath) => path.resolve(customPluginPath)))

  const plugins: Plugin[] = pluginPaths.map((pluginPath) => <Plugin>require(pluginPath).default)

  plugins.forEach(({ name, description }) =>
    console.log(`Loading plugin "${name}"`, description ? `: ${description}` : '')
  )
  console.log() // Insert empty line for better log formatting

  return (plugins.length ? plugins : [identityPlugin]).reduce(combinePlugins)
}
