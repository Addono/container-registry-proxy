import request from './request'

interface Tag {
  name: string
}

const getTags = async (repository: string): Promise<Tag[]> => {
  try {
    const result = await request(`/v2/repositories/${repository}/tags/`)
    const tags = result.data?.results?.map(({ name }: { name: string }) => ({ name }))

    return tags ?? []
  } catch (error) {
    console.error(error)
    return []
  }
}

export default getTags
