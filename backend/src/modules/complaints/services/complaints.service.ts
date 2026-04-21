import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Complaint } from '@/modules/complaints/entities/complaint.entity';
import { CreateComplaintDto } from '@/modules/complaints/dto/create-complaint.dto';
import { UpdateComplaintDto } from '@/modules/complaints/dto/update-complaint.dto';
import { ImageAnalysisService } from '@/modules/ai/services/image-analysis.service';
import { NotificationsService } from '@/modules/notifications/services/notifications.service';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private readonly repo: Repository<Complaint>,
    private readonly aiService: ImageAnalysisService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(page = 1, limit = 10, search?: string, status?: string) {
    const where: any = {};
    if (search) where.description = Like(`%${search}%`);
    if (status) where.status = status;

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      relations: ['user'],
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    return { items, total, page: Number(page), lastPage: Math.ceil(total / Number(limit)) };
  }

  async create(dto: CreateComplaintDto) {
    // [SECURITY INTEGRATION] AI Pre-Analysis
    if (dto.imageUrl) {
      const analysis = await this.aiService.analyzeImage(dto.imageUrl);
      
      if (analysis.isFake) {
        // Envia notificação em tempo real sobre o bloqueio
        await this.notificationsService.notifyUser(
          (dto as any).userId,
          '⚠️ Alerta de Segurança',
          'Sua queixa foi BLOQUEADA pois detectamos manipulação digital na imagem enviada (Deepfake). Transparência é vital para a ECOA.',
          'error'
        );
        
        throw new ForbiddenException('Postagem bloqueada: Imagem detectada como manipulada.');
      }
    }

    const item = this.repo.create(dto as any);
    return this.repo.save(item);
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!item) throw new NotFoundException('Queixa não encontrada');
    return item;
  }

  async update(id: string, dto: UpdateComplaintDto) {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { success: true };
  }
}
