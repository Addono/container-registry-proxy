import http from 'http'
import https from 'https'
import proxyUrlParser, { Method } from './proxyUrlParser'

const PORT: string = process.env?.PORT ?? '8080'
const REGISTRY_HOST: string = process.env?.REGISTRY_HOST ?? 'registry.hub.docker.com'
const HTTPS: boolean = process.env?.HTTPS?.toLowerCase() != 'false' ?? true

const settingsFormatted: string = [
  ['PORT', PORT],
  ['REGISTRY_HOST', REGISTRY_HOST],
  ['HTTPS', HTTPS],
]
  .map(([key, value]) => ` - ${key}=${value}`)
  .reduce((a, b) => `${a}\n${b}`)

console.log(`Configuration:\n${settingsFormatted}\n`)

const URL_REGEX = /^\/([\w\d]*)\/(?:([\s\S]+)\/(manifests|blobs)\/([\w\d:]+))?$/

const server = http.createServer((req, res) => {
  const failRequest = (message: string) => {
    console.error(message)

    res.writeHead(500, { 'content-type': 'text/plain' }).end(message)
  }

  console.log(req.headers, req.url)

  if (!req.url) {
    return failRequest('Path cannot be empty')
  }

  const containerRegistryRequest = proxyUrlParser(req.url)
  if (!containerRegistryRequest) {
    return failRequest(`Could not parse url "${req.url}"`)
  }

  const { version, parameters } = containerRegistryRequest

  const url = parameters
    ? `${REGISTRY_HOST}/${version}/${parameters.repository}/${Method[parameters.method]}/${parameters.tag}`
    : `${REGISTRY_HOST}/${version}/`

  console.log(`==> Forwarding request to ${url}\n`)

  console.log('\t-> ', req.headers)

  // Pause the ongoing request until the forwarded request returns
  req.pause()

  const connection = (HTTPS ? https : http).request(
    `${HTTPS ? 'https' : 'http'}://${url}`,
    {
      headers: {
        ...req.headers,
        host: REGISTRY_HOST, // Overwrite the host as the prevent certificate issues
      },
      method: req.method,
      agent: false,
    },
    (serverResponse) => {
      let { statusCode, headers } = serverResponse

      console.log('<== Received response for', statusCode, url)
      console.log('\t-> Response Headers: ', headers)

      serverResponse.pause()

      // fix host and pass through.
      if (statusCode && [301, 302, 303].includes(statusCode)) {
        statusCode = 303
        headers['location'] = `http://localhost:${PORT}/${headers['location']}`

        console.log('\t-> Redirecting to ', headers['location'])

        res.writeHead(statusCode, headers)
        serverResponse.pipe(res)
      } else if (statusCode && 200 <= statusCode && statusCode < 500) {
        res.writeHead(statusCode, headers)
        serverResponse.pipe(res)
      } else {
        const stringifiedHeaders = JSON.stringify(headers, null, 4)
        return failRequest(`Error ${statusCode}\n${stringifiedHeaders}`)
      }

      serverResponse.resume()

      console.log('\n\n')
    }
  )

  req.pipe(connection)
  req.resume()
})

console.log('Starting server...\n')

server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT} 🚀\n`))
