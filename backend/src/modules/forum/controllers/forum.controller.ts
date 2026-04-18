import { Controller, Get, Post, Body, Param, Patch, Delete, Put, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ForumPost } from '../entities/forum-post.entity';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Forum')
@Controller('forum')
export class ForumController {
  constructor(
    @InjectRepository(ForumPost)
    private readonly repo: Repository<ForumPost>,
  ) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const where: any = {};
    if (search) where.content = Like(`%${search}%`);
    if (category) where.category = category;

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { items, total, page, lastPage: Math.ceil(total / limit) };
  }

  @Post()
  create(@Body() data: Partial<ForumPost>) {
    const post = this.repo.create(data);
    return this.repo.save(post);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repo.findOne({ where: { id } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<ForumPost>) {
    return this.repo.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repo.delete(id);
  }

  @Patch(':id/like')
  async like(@Param('id') id: string) {
    await this.repo.increment({ id }, 'likes', 1);
    return { success: true };
  }

  @Patch(':id/dislike')
  async dislike(@Param('id') id: string) {
    await this.repo.increment({ id }, 'dislikes', 1);
    return { success: true };
  }

  @Patch(':id/view')
  async view(@Param('id') id: string) {
    await this.repo.increment({ id }, 'views', 1);
    return { success: true };
  }
}
