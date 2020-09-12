import axios from 'axios'
import apiConfig from '@config/api'

const { baseURL } = apiConfig
export default axios.create({
  baseURL,
})
