import axios from 'axios'

const api = axios.create({
  // same-origin: /urls ide na isti host:port kao frontend (nginx)
  baseURL: '',
  timeout: 5000,
})

export default api
