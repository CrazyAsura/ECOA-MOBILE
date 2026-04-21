import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumPost } from './entities/forum-post.entity';
import { ForumComment } from './entities/forum-comment.entity';
import { ForumController } from './controllers/forum.controller';
import { ForumService } from './services/forum.service';

@Module({
  imports: [TypeOrmModule.forFeature([ForumPost, ForumComment])],
  controllers: [ForumController],
  providers: [ForumService],
  exports: [ForumService],
})
export class ForumModule {}
