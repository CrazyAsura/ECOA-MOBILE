import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { StatsService } from '../services/stats.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Statistics')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Post('visit')
  @ApiOperation({ summary: 'Log de entrada no site' })
  logVisit(@Body() data: { path: string; userAgent: string }, @Req() req: any) {
    return this.statsService.logVisit({
      ...data,
      ip: req.ip || '0.0.0.0',
    });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Obter resumo de estatísticas' })
  getSummary() {
    return this.statsService.getStats();
  }
}
