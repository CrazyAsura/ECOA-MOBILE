import axios from 'axios';
import { z } from 'zod';

// You can configure your base URL here
const api = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example of how to use Zod for validation with axios
export const validateResponse = <T>(schema: z.ZodSchema<T>, data: any): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('Validation Error:', result.error.format());
    throw new Error('API Response validation failed');
  }
  return result.data;
};

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    return Promise.reject(error);
  }
);

export default api;
