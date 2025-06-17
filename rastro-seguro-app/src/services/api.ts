import axios from 'axios';

const api = axios.create({
  baseURL: 'http://TU_BACKEND_URL:5000/api',
});

export default api;
