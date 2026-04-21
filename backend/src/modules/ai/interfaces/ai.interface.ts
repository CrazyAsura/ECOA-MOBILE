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

export interface AIService {
  analyzeImage(imageUrl: string): Promise<ImageAnalysisResult>;
  classifyImage(imageUrl: string): Promise<string[]>;
  generateChatResponse(message: string, context?: string): Promise<string>;
}
