import axios from 'axios';

// ATENÇÃO: Verifique se este arquivo NÃO contém 'import { ... } from "@env"'
// Se o erro persistir, limpe o cache do Metro com 'npx expo start -c'
const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
