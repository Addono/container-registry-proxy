import { Method, Plugin } from '../plugins'
import getTags from '../requests/getTags'

const tagChaos: Plugin = {
  name: 'Tag Chaos',
  description: 'Ignores the requested tag and replaces it with a random one',
  requestPipe: async (request) => {
    const { parameters, host, https } = request

    // Ignore all non-manifest calls
    if (parameters?.method !== Method.manifests) {
      return request
    }

    const tags = await getTags({ repository: parameters.repository, https, host })

    if (tags.length == 0) {
      console.error('tagChaos: no tags returned, forwarding as normal')
      return request
    }

    const randomTag = tags[Math.floor(Math.random() * tags.length)]
    console.log(`tagChaos: ${randomTag.name} replaced ${parameters.tag}`)

    return {
      ...request,
      parameters: {
        ...parameters,
        tag: randomTag.name,
      },
    }
  },
}

export default tagChaos
