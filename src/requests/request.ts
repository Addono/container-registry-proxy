import axios, { AxiosResponse } from 'axios'

const request: (args: { host: string; path: string; https: boolean }) => Promise<AxiosResponse> = ({
  host,
  path,
  https,
}) => {
  const url = `${https ? 'https' : 'http'}://${host}${path}`

  return axios.get(url)
}

export default request
