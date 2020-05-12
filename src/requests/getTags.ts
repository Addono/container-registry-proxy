import request from './request'

interface Tag {
  name: string
}

const getTags: (opts: { repository: string; https: boolean; host: string }) => Promise<Tag[]> = async ({
  repository,
  https,
  host,
}) => {
  try {
    const result = await request({ https, host, path: `/v2/repositories/${repository}/tags/` })
    const tags = result.data?.results?.map(({ name }: { name: string }) => ({ name }))

    return tags ?? []
  } catch (error) {
    console.error(error)
    return []
  }
}

export default getTags
