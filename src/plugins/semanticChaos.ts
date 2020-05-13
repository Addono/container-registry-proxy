import { Method, Plugin } from '../plugins'
import getTags from '../requests/getTags'
import { isRelaxedTagOf, SEMANTIC_TAG_REGEX } from './utils/semanticVersioning'

/**
 * Checks if a value is not null or undefined.
 * @param value The value to be checked.
 */
const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
  return value !== null && value !== undefined
}

const semanticChaosPlugin: Plugin = {
  name: 'SemanticChaos',
  description: 'Exploits freedom in weak semantic versioning.',
  requestPipe: async (request) => {
    const { parameters, host, https } = request

    // Ignore all non-manifest calls
    if (parameters?.method !== Method.manifests) {
      return request
    }

    // Ignore all requests which are not a semantic tag
    const requestedSemanticTag = parameters.tag.match(SEMANTIC_TAG_REGEX)
    if (!requestedSemanticTag) {
      return request
    }

    // Retrieve all tags
    const tags = await getTags({ repository: parameters.repository, https, host })

    // Filter out all tags which are not (weak) semantically versioned
    const availableSemanticTags = tags
      // Parse each tag to detect if it's a semantic tag
      .map((tag) => tag.name.match(SEMANTIC_TAG_REGEX))
      // Remove all tags which are not formatted as a semantic tag
      .filter(notEmpty)

    // Remove all tags which are not a more relaxed version of the targeted tag
    const potentialTags = availableSemanticTags
      .filter((match) => isRelaxedTagOf(requestedSemanticTag, match))
      .map((tag) => tag.input)
      .filter(notEmpty)

    // Handle the case in which no tags are detected
    if (potentialTags.length === 0) {
      console.log('SEMANTICCHAOS: No potential tags detected, forwarding as normal')
      return request
    }

    // Select a tag at random
    const randomTag = potentialTags[Math.floor(Math.random() * potentialTags.length)]
    console.log(`SEMANTICCHAOS: ${randomTag} replaces ${parameters.tag}, potential tags were `, potentialTags)

    // Build a modified version of the response
    return {
      ...request,
      parameters: {
        ...parameters,
        tag: randomTag,
      },
    }
  },
}

export default semanticChaosPlugin
