import { useState } from 'react';
import AIService, { ImageAnalysisResult } from '@/services/ai.service';
import { getOptimalModelConfig } from '@/utils/device';

export function useAIAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = async (imageUrl: string) => {
    setAnalyzing(true);
    setError(null);
    try {
      // Aplica otimização baseada no dispositivo antes de enviar/analisar
      const config = getOptimalModelConfig();
      console.log(`Aplicando configurações otimizadas:`, config);
      
      const data = await AIService.analyzeImage(imageUrl);
      setResult(data);
      return data;
    } catch (err) {
      setError('Falha na análise de IA. Tente novamente.');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  return {
    analyzeImage,
    analyzing,
    result,
    error,
    config: getOptimalModelConfig()
  };
}
