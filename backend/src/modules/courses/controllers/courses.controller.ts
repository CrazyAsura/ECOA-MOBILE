import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(@InjectRepository(Course) private readonly repo: Repository<Course>) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('category') category?: string,
    @Query('level') level?: string,
  ) {
    const where: any = {};
    if (category) where.category = category;
    if (level) where.level = level;

    const [items, total] = await this.repo.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
    });

    return { items, total, page, lastPage: Math.ceil(total / limit) };
  }

  @Post()
  create(@Body() data: Partial<Course>) {
    const item = this.repo.create(data);
    return this.repo.save(item);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repo.findOne({ where: { id } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Course>) {
    return this.repo.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repo.delete(id);
  }
}
