import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Complaint } from '../entities/complaint.entity';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Complaints')
@Controller('complaints')
export class ComplaintsController {
  constructor(
    @InjectRepository(Complaint)
    private readonly repo: Repository<Complaint>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar queixas com busca, filtros e paginação' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'public', required: false, type: 'boolean' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('public') isPublic?: string,
  ) {
    const where: any = {};
    if (search) where.title = Like(`%${search}%`);
    if (status) where.status = status;
    if (isPublic !== undefined) where.isPublic = isPublic === 'true';

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { items, total, page, lastPage: Math.ceil(total / limit) };
  }

  @Post()
  create(@Body() data: Partial<Complaint>) {
    const item = this.repo.create(data);
    return this.repo.save(item);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repo.findOne({ where: { id }, relations: ['user'] });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Complaint>) {
    return this.repo.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repo.delete(id);
  }
}
