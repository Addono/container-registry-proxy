import { Method, Plugin } from '../plugins'
import getTags from '../requests/getTags'

const tagChaos: Plugin = {
  name: 'Tag Chaos',
  description: 'Ignores the requested tag and replaces it with a random one',
  requestPipe: async ({ parameters, ...args }) => {
    // Ignore all non-manifest calls
    if (parameters?.method !== Method.manifests) {
      return { parameters, ...args }
    }

    const tags = await getTags(parameters.repository)

    if (tags.length == 0) {
      console.error('tagChaos: no tags returned, forwarding as normal')
      return { parameters, ...args }
    }

    const randomTag = tags[Math.floor(Math.random() * tags.length)]
    console.log(`tagChaos: ${randomTag.name} replaced ${parameters.tag}`)

    return {
      parameters: {
        ...parameters,
        tag: randomTag.name,
      },
      ...args,
    }
  },
}

export default tagChaos
