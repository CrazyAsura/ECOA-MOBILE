import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ForumPost } from '../entities/forum-post.entity';
import { ForumComment } from '../entities/forum-comment.entity';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumPost)
    private readonly repo: Repository<ForumPost>,
    @InjectRepository(ForumComment)
    private readonly commentRepo: Repository<ForumComment>,
  ) {}

  async findAll(page = 1, limit = 10, search?: string, category?: string) {
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

  async findOne(id: string) {
    const post = await this.repo.findOne({ where: { id }, relations: ['comments'] });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(data: Partial<ForumPost>) {
    const post = this.repo.create(data);
    return this.repo.save(post);
  }

  async update(id: string, data: Partial<ForumPost>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    return { success: result.affected > 0 };
  }

  async like(id: string) {
    await this.repo.increment({ id }, 'likes', 1);
    return { success: true };
  }

  async dislike(id: string) {
    await this.repo.increment({ id }, 'dislikes', 1);
    return { success: true };
  }

  async incrementView(id: string) {
    await this.repo.increment({ id }, 'views', 1);
    return { success: true };
  }

  async addComment(postId: string, data: Partial<ForumComment>) {
    const post = await this.findOne(postId);
    const comment = this.commentRepo.create({ ...data, post });
    await this.repo.increment({ id: postId }, 'commentsCount', 1);
    return this.commentRepo.save(comment);
  }

  async findComments(postId: string) {
    return this.commentRepo.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
    });
  }

  async likeComment(commentId: string) {
    await this.commentRepo.increment({ id: commentId }, 'likes', 1);
    return { success: true };
  }

  async dislikeComment(commentId: string) {
    await this.commentRepo.increment({ id: commentId }, 'dislikes', 1);
    return { success: true };
  }

  async reportComment(commentId: string) {
    await this.commentRepo.increment({ id: commentId }, 'reportCount', 1);
    return { success: true };
  }
}
