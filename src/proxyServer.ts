import http, { Server } from 'http'
import https from 'https'

import proxyUrlParser from './proxyUrlParser'
import { Method } from './plugins'
import { HTTPS, PORT, REGISTRY_HOST } from './index'
import { Plugin } from './plugins'

const proxyServer: (plugin: Plugin) => Server = ({ requestPipe }) =>
  http.createServer(async (req, res) => {
    const failRequest = (message: string) => {
      console.error(message)

      res.writeHead(500, { 'content-type': 'text/plain' }).end(message)
    }

    console.log('Received request for ', req.url)

    if (!req.url) {
      return failRequest('Path cannot be empty')
    }

    const containerRegistryRequest = proxyUrlParser(req.url)
    if (!containerRegistryRequest) {
      return failRequest(`Could not parse url "${req.url}"`)
    }

    const requestPostPipe = await requestPipe(containerRegistryRequest)
    if (!requestPostPipe) {
      return failRequest(`Request aborted by plugins`)
    }

    const { version, parameters } = requestPostPipe

    const url = parameters
      ? `${REGISTRY_HOST}/${version}/${parameters.repository}/${Method[parameters.method]}/${parameters.tag}`
      : `${REGISTRY_HOST}/${version}/`

    // Pause the ongoing request until the forwarded request returns
    req.pause()

    console.log(`==> Forwarding request to ${url}\n`)

    // console.log('\t-> ', req.headers)

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
        // console.log('\t-> Response Headers: ', headers)

        serverResponse.pause()

        // Return an error if the error code is not within [200, 500)
        if (!statusCode || statusCode < 200 || statusCode >= 500) {
          const stringifiedHeaders = JSON.stringify(headers, null, 4)
          return failRequest(`Error ${statusCode}\n${stringifiedHeaders}`)
        }

        // fix host and pass through.
        if (statusCode && [301, 302, 303].includes(statusCode)) {
          const location = headers['location']

          /*
           * Group 1: Protocol
           * Group 2: Hostname
           * Group 3: Path
           */
          const REDIRECT_LOCATION_MATCHER = /^(https?:\/\/)([^\/]*)([\s\S]*)$/
          const redirectLocationMatches = location?.match(REDIRECT_LOCATION_MATCHER)
          if (!redirectLocationMatches) {
            return failRequest(
              `Received redirect response code ${statusCode} however no redirect location detected: ${location}.`
            )
          }

          const [, protocol, domain, path]: string[] = redirectLocationMatches
          headers['location'] = protocol + domain.replace(REGISTRY_HOST, `localhost:${PORT}`) + path

          statusCode = 303
          console.log('\t-> Redirecting to ', headers['location'])
        }

        res.writeHead(statusCode, headers)

        // Forward the request to the proxy
        serverResponse.pipe(res)
        serverResponse.resume()

        console.log('\n\n')
      }
    )

    req.pipe(connection)
    req.resume()
  })

export default proxyServer
