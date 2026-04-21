import { Module } from '@nestjs/common';
import { ImageAnalysisService } from '@/modules/ai/services/image-analysis.service';
import { ChatbotService } from '@/modules/ai/services/chatbot.service';
import { AIController } from '@/modules/ai/controllers/ai.controller';

@Module({
  providers: [ImageAnalysisService, ChatbotService],
  controllers: [AIController],
  exports: [ImageAnalysisService, ChatbotService],
})
export class AIModule { }
