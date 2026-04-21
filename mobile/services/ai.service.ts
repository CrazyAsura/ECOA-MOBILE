import api from './api';

export interface AnalysisMethodResult {
  name: string;
  score: number;
}

export interface ImageAnalysisResult {
  isFake: boolean;
  confidence: number;
  message: string;
  methods: AnalysisMethodResult[];
}

const AIService = {
  analyzeImage: async (imageUrl: string) => {
    const res = await api.post<ImageAnalysisResult>('/ai/analyze-image', { imageUrl });
    return res.data;
  },

  chat: async (message: string, context?: string) => {
    const res = await api.post<string>('/ai/chat', { message, context });
    return res.data;
  },

  classify: async (imageUrl: string) => {
    const res = await api.get<string[]>('/ai/classify', { params: { imageUrl } });
    return res.data;
  }
};

export default AIService;
