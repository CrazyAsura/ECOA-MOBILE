import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ImageAnalysisService } from '@/modules/ai/services/image-analysis.service';
import { ChatbotService } from '@/modules/ai/services/chatbot.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI-Advanced')
@Controller('ai')
export class AIController {
  constructor(
    private readonly imageService: ImageAnalysisService,
    private readonly chatbotService: ChatbotService,
  ) {}

  @Post('analyze-image')
  @ApiOperation({ summary: 'Analisar autenticidade de imagem e detectar manipulações' })
  analyzeImage(@Body('imageUrl') imageUrl: string) {
    return this.imageService.analyzeImage(imageUrl);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chatbot contextual FLAN-T5' })
  chat(@Body('message') message: string, @Body('context') context?: string) {
    return this.chatbotService.generateChatResponse(message, context);
  }

  @Get('classify')
  @ApiOperation({ summary: 'Classificação zero-shot de categorias ambientais' })
  classify(@Query('imageUrl') imageUrl: string) {
    return this.imageService.classifyImage(imageUrl);
  }
}
