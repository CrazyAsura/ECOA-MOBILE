import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumPost } from './entities/forum-post.entity';
import { ForumController } from './controllers/forum.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ForumPost])],
  controllers: [ForumController],
  exports: [TypeOrmModule],
})
export class ForumModule {}
