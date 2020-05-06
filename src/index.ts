import http from 'http'
import https from 'https'

const PORT = process.argv[2] || 8080

const URL_REGEX = /^\/([\w\d]*)\/(?:([^\/]*)\/(\d{1,6})\/([\s\S]+)\/(manifests|blobs)\/([\w\d:]+))?$/

const server = http.createServer((req, res) => {
  const failRequest = (message: string) => {
    console.error(message)

    res.writeHead(500, { 'content-type': 'text/plain' }).end(message)
  }

  console.log(req.headers, req.url)

  const matches = req.url?.match(URL_REGEX)

  if (!matches) {
    return failRequest('Failed parsing the url')
  }

  const [_, version, domain, port, image, method, reference]: string[] = matches

  console.log(`Method: ${method}`)

  let url: string
  if (!domain) {
    // Return a plain 200 when the domain was not part of the url
    res.statusCode = 200
    res.end()
    return
  } else if (method == 'manifests' || method == 'blobs') {
    url = `http://${domain}:${port}/${version}/${image}/${method}/${reference}`
  } else {
    failRequest(`Unknown method ${method}`)
    return
  }

  console.log(`==> Forwarding request to ${url}\n`)

  console.log('\t-> ', req.headers)

  // Pause the ongoing request until the forwarded request returns
  req.pause()

  const connection = http.request(
    url,
    {
      headers: {
        ...req.headers,
        host: domain, // Overwrite the host as the prevent certificate issues
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
