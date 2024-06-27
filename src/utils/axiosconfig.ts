import axios from 'axios'

const axiosApi = axios.create({
  baseURL: 'http://localhost:8967',
  // timeout: 6000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosApi
