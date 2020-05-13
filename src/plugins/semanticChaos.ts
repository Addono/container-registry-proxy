import { Method, Plugin } from '../plugins'
import getTags from '../requests/getTags'

/*
 * Weak semantic versioning matches. Here "weak" refers to the
 * fact that the minor and patch version are optional. Which
 * is not the case in normal semantic versioning.
 *
 * Group 1 (Optional): Prefix (not part of official semver)
 * Group 2: Major
 * Group 3 (Optional): Minor (not optional in official semver)
 * Group 4 (Optional): Patch (not optional in official semver)
 * Group 5 (Optional): Pre-release
 * Group 6 (Optional): Build Metadata
 */
const SEMANTIC_TAG_REGEX = /^(v?)(0|[1-9]\d*)(?:\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)?)?$/

/**
 * Checks if a value is not null or undefined.
 * @param value The value to be checked.
 */
const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
  return value !== null && value !== undefined
}

/**
 * Zips multiple arrays together. Similar to zip([arr, ...]) in Python.
 * @param rows The arrays to be zipped.
 */
const zip = <TValue>(rows: TValue[][]): TValue[][] => rows[0].map((_, c) => rows.map((row) => row[c]))

const isRelaxedTagOf = (requestedSemanticTag: RegExpMatchArray, match: RegExpMatchArray) =>
  zip([match, requestedSemanticTag])
    .slice(1, 6)
    // Check for each entry if the requested value is set and if so equal to the given value
    .map(([given, requested]) => requested == undefined || requested == given)
    // Remove all tags which had a mismatch
    .filter((result) => !result).length == 0

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
