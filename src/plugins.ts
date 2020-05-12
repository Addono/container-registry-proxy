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

type RequestPipe = (req: Request) => Promise<Request>

const identityPlugin: Plugin = {
  name: 'identity plugin',
  description: 'this plugin does not alter anything',
  requestPipe: async (req) => req,
}

export const loadPlugins: (pluginNames: string[]) => Plugin = (pluginNames) => {
  const plugins: Plugin[] = pluginNames.map(
    (pluginName) => <Plugin>require(`./plugins/${pluginName}`).default
  )

  plugins.forEach(({ name, description }) =>
    console.log(`Loading plugin "${name}"`, description ? `: ${description}` : '')
  )
  console.log() // Insert empty line for better log formatting

  const combinedPlugins: Plugin = (plugins.length ? plugins : [identityPlugin]).reduce((p1, p2) => ({
    name: `${p1.name}+${p2.name}`,
    requestPipe: async (req) => p2.requestPipe(await p1.requestPipe(req)),
  }))

  return combinedPlugins
}
