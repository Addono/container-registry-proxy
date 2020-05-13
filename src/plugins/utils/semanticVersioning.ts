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
export const SEMANTIC_TAG_REGEX = /^(v?)(0|[1-9]\d*)(?:\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)?)?$/

/**
 * Zips multiple arrays together. Similar to zip([arr, ...]) in Python.
 * @param rows The arrays to be zipped.
 */
const zip = <TValue>(rows: TValue[][]): TValue[][] => rows[0].map((_, c) => rows.map((row) => row[c]))

export const isRelaxedTagOf = (requestedSemanticTag: RegExpMatchArray, match: RegExpMatchArray) =>
  zip([match, requestedSemanticTag])
    .slice(1, 7)
    // Check for each entry if the requested value is set and if so equal to the given value
    .map(([given, requested]) => requested == undefined || requested == given)
    // Remove all tags which had a mismatch
    .filter((result) => !result).length == 0
