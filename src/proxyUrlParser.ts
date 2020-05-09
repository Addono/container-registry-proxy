import { Request, Method } from './plugins'

/*
 * Group 1: version
 * Optional:
 * - Group 2: repository name
 * - Group 3: request method
 * - Group 4: tag
 */
const URL_REGEX = /^\/([\w\d]*)\/(?:([\s\S]+)\/(manifests|blobs)\/([\s\S]+))?$/

const proxyUrlParser: (url: string) => Request | undefined = (url) => {
  const matches = url.match(URL_REGEX)

  // Return undefined in case the URL could not be parsed
  if (!matches) {
    return
  }

  // Decompose the matches
  const [, version, repository, methodAsString, tag] = matches

  // Cast the method from a string to the Method enum
  const method: Method | undefined = (<any>Method)[methodAsString]

  const parameters =
    repository && tag && method !== undefined
      ? {
          repository,
          method,
          tag,
        }
      : undefined

  return {
    version,
    parameters,
  }
}

export default proxyUrlParser
