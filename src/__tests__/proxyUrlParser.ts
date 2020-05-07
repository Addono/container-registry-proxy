import proxyUrlParser, { Method } from '../proxyUrlParser'

describe('test proxy url parser', () => {
  it('parses a /v2/ version check call', () => {
    // Arrange
    const url = '/v2/'

    // Act
    const result = proxyUrlParser(url)

    // Assert
    expect(result).toHaveProperty('version', 'v2')
    expect(result?.parameters).toBeUndefined()
  })

  it('parses a blobs request call', () => {
    // Arrange
    const url =
      '/v2/repository/image/blobs/sha256:dd731a7214510cbae667108943d0e07b96c7beb3a3ade18bd756445b2b79a209'

    // Act
    const result = proxyUrlParser(url)

    // Assert
    expect(result).toHaveProperty('version', 'v2')
    expect(result).toHaveProperty('parameters.repository', 'repository/image')
    expect(result).toHaveProperty('parameters.method', Method.blobs)
    expect(result).toHaveProperty(
      'parameters.tag',
      'sha256:dd731a7214510cbae667108943d0e07b96c7beb3a3ade18bd756445b2b79a209'
    )
  })

  it('parses a manifests request call', () => {
    // Arrange
    const url = '/v2/repository/image/manifests/latest'

    // Act
    const result = proxyUrlParser(url)

    // Assert
    expect(result).toHaveProperty('version', 'v2')
    expect(result).toHaveProperty('parameters.repository', 'repository/image')
    expect(result).toHaveProperty('parameters.method', Method.manifests)
    expect(result).toHaveProperty('parameters.tag', 'latest')
  })

  it('parses a manifests request which tag has numbers', () => {
    // Arrange
    const url = '/v2/repository/image/manifests/v2'

    // Act
    const result = proxyUrlParser(url)

    // Assert
    expect(result).toHaveProperty('version', 'v2')
    expect(result).toHaveProperty('parameters.repository', 'repository/image')
    expect(result).toHaveProperty('parameters.method', Method.manifests)
    expect(result).toHaveProperty('parameters.tag', 'v2')
  })

  it('parses a manifests request which tag has a dash', () => {
    // Arrange
    const url = '/v2/repository/image/manifests/latest-alpine'

    // Act
    const result = proxyUrlParser(url)

    // Assert
    expect(result).toHaveProperty('version', 'v2')
    expect(result).toHaveProperty('parameters.repository', 'repository/image')
    expect(result).toHaveProperty('parameters.method', Method.manifests)
    expect(result).toHaveProperty('parameters.tag', 'latest-alpine')
  })

  it('parses a manifests request which repository has a dash', () => {
    // Arrange
    const url = '/v2/my-repository/image/manifests/latest'

    // Act
    const result = proxyUrlParser(url)

    // Assert
    expect(result).toHaveProperty('version', 'v2')
    expect(result).toHaveProperty('parameters.repository', 'my-repository/image')
    expect(result).toHaveProperty('parameters.method', Method.manifests)
    expect(result).toHaveProperty('parameters.tag', 'latest')
  })
})
