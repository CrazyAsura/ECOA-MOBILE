import axios from 'axios';
import { Platform } from 'react-native';

// Detecta o host correto baseado na plataforma
// 10.0.2.2 é o alias para localhost no emulador Android
const getBaseUrl = () => {
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
