import axios from 'axios'
import { HTTPS, REGISTRY_HOST } from '../index'

const request = (path: string) => {
  const url = `${HTTPS ? 'https' : 'http'}://${REGISTRY_HOST}${path}`

  return axios.get(url)
}

export default request
