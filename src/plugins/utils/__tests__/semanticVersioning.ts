import { isRelaxedTagOf, SEMANTIC_TAG_REGEX } from '../semanticVersioning'
import assert from 'assert'

describe('Test semanticVersioning util regex', () => {
  it('correctly parses 0.0.1 to be a SemVer tag', () => {
    // Arrange
    const target = '0.0.1'

    // Act
    const result = target.match(SEMANTIC_TAG_REGEX)

    // Assert
    expect(result?.slice(1, 7)).toStrictEqual(['', '0', '0', '1', undefined, undefined])
  })

  it('correctly parses 1.0.0-prerelease to be a SemVer tag', () => {
    // Arrange
    const target = '1.0.0-prerelease'

    // Act
    const result = target.match(SEMANTIC_TAG_REGEX)

    // Assert
    expect(result?.slice(1, 7)).toStrictEqual(['', '1', '0', '0', 'prerelease', undefined])
  })

  it('correctly parses v5.4.3-prereleaseV1+build404 to be a SemVer tag', () => {
    // Arrange
    const target = 'v5.4.3-prereleaseV1+build404'

    // Act
    const result = target.match(SEMANTIC_TAG_REGEX)

    // Assert
    expect(result?.slice(1, 7)).toStrictEqual(['v', '5', '4', '3', 'prereleaseV1', 'build404'])
  })

  it('does NOT consider v5.4.A to be a SemVer tag', () => {
    // Arrange
    const target = 'v5.4.A'

    // Act
    const result = target.match(SEMANTIC_TAG_REGEX)

    // Assert
    expect(result).toBe(null)
  })

  it('considers 0.1 to be a weak SemVer tag', () => {
    // Arrange
    const target = '0.1'

    // Act
    const result = target.match(SEMANTIC_TAG_REGEX)

    // Assert
    expect(result?.slice(1, 7)).toStrictEqual(['', '0', '1', undefined, undefined, undefined])
  })

  it('considers 1 to be a weak SemVer tag', () => {
    // Arrange
    const target = '1'

    // Act
    const result = target.match(SEMANTIC_TAG_REGEX)

    // Assert
    expect(result?.slice(1, 7)).toStrictEqual(['', '1', undefined, undefined, undefined, undefined])
  })

  it('considers v0 to be a weak SemVer tag', () => {
    // Arrange
    const target = 'v0'

    // Act
    const result = target.match(SEMANTIC_TAG_REGEX)

    // Assert
    expect(result?.slice(1, 7)).toStrictEqual(['v', '0', undefined, undefined, undefined, undefined])
  })

  it('does NOT consider 0.01.0 to be a SemVer tag', () => {
    // Arrange
    const target = '0.01.0'

    // Act
    const result = target.match(SEMANTIC_TAG_REGEX)

    // Assert
    expect(result).toBe(null)
  })
})

describe('semanticVersion util isRelaxedTagOf', () => {
  it('matches weaker build versions', () => {
    // Arrange
    const target = '0.0.1'.match(SEMANTIC_TAG_REGEX)
    const match = '0.0.1+build-v1'.match(SEMANTIC_TAG_REGEX)

    // Act
    assert(target && match)
    const result = isRelaxedTagOf(target, match)

    // Assert
    expect(result).toBe(true)
  })

  it('matches weaker patch versions', () => {
    // Arrange
    const target = '0.1'.match(SEMANTIC_TAG_REGEX)
    const match = '0.1.1'.match(SEMANTIC_TAG_REGEX)

    // Act
    assert(target && match)
    const result = isRelaxedTagOf(target, match)

    // Assert
    expect(result).toBe(true)
  })

  it('matches weaker minor versions', () => {
    // Arrange
    const target = '1'.match(SEMANTIC_TAG_REGEX)
    const match = '1.1.0'.match(SEMANTIC_TAG_REGEX)

    // Act
    assert(target && match)
    const result = isRelaxedTagOf(target, match)

    // Assert
    expect(result).toBe(true)
  })

  it('matches expanded major version', () => {
    // Arrange
    const target = '1'.match(SEMANTIC_TAG_REGEX)
    const match = '1.0.0'.match(SEMANTIC_TAG_REGEX)

    // Act
    assert(target && match)
    const result = isRelaxedTagOf(target, match)

    // Assert
    expect(result).toBe(true)
  })

  it('does not match same build on different patches', () => {
    // Arrange
    const target = '0.0.1+build1'.match(SEMANTIC_TAG_REGEX)
    const match = '0.0.2+build1'.match(SEMANTIC_TAG_REGEX)

    // Act
    assert(target && match)
    const result = isRelaxedTagOf(target, match)

    // Assert
    expect(result).toBe(false)
  })

  it('does not match same level patch versions', () => {
    // Arrange
    const target = '0.0.1'.match(SEMANTIC_TAG_REGEX)
    const match = '0.0.2'.match(SEMANTIC_TAG_REGEX)

    // Act
    assert(target && match)
    const result = isRelaxedTagOf(target, match)

    // Assert
    expect(result).toBe(false)
  })

  it('does not match same level minor versions', () => {
    // Arrange
    const target = '0.1'.match(SEMANTIC_TAG_REGEX)
    const match = '0.2'.match(SEMANTIC_TAG_REGEX)

    // Act
    assert(target && match)
    const result = isRelaxedTagOf(target, match)

    // Assert
    expect(result).toBe(false)
  })

  it('does not match same level major versions', () => {
    // Arrange
    const target = '1'.match(SEMANTIC_TAG_REGEX)
    const match = '2'.match(SEMANTIC_TAG_REGEX)

    // Act
    assert(target && match)
    const result = isRelaxedTagOf(target, match)

    // Assert
    expect(result).toBe(false)
  })
})
