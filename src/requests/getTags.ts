import request from './request'

interface Tag {
  name: string
}

const getTags: (opts: { repository: string; https: boolean; host: string }) => Promise<Tag[]> = async ({
  repository,
  https,
  host,
}) => {
  // Prefer the v1 API over v2, as it will return all tags on the first request
  try {
    const result = await request({ https, host, path: `/v1/repositories/${repository}/tags` })
    const tags = result.data?.map(({ name }: { name: string }) => ({ name }))

    if (tags?.length > 0) {
      return tags
    }
  } catch (error) {
    console.error(error)
  }

  console.log('Failed retrieving tags using the v1 API, falling back to v2')

  try {
    // @todo Add pagination to properly iterate through all tags
    const result = await request({
      https,
      host,
      path: `/v2/repositories/${repository}/tags/?page_size=10000`,
    })
    const tags = result.data?.results?.map(({ name }: { name: string }) => ({ name }))

    if (tags?.length > 0) {
      return tags
    }
  } catch (error) {
    console.error(error)
  }

  return []
}

export default getTags
