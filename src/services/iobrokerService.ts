import axios from 'axios'

const defaultBase = import.meta.env.VITE_IOBROKER_URL || 'http://iobroker:8087'

class IoBrokerService {
  base = defaultBase

  setBase(url: string) {
    this.base = url
  }

  async read(path: string) {
    return axios.get(`${this.base}/${path}`)
  }

  async write(path: string, payload: any) {
    return axios.post(`${this.base}/${path}`, payload)
  }
}

export default new IoBrokerService()

