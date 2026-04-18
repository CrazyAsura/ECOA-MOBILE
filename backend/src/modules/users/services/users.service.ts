import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email já cadastrado');

    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }

  async addXp(userId: string, amount: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) return;

    user.xp += amount;
    
    const newLevel = Math.floor(user.xp / 1000) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }

    return this.userRepo.save(user);
  }

  async login(credentials: any) {
    const user = await this.userRepo.findOne({ 
      where: { email: credentials.email },
      relations: ['address', 'phones'] 
    });

    if (user && await argon2.verify(user.password, credentials.password)) {
      const { password, ...result } = user;
      return { user: result, token: 'mock-jwt-token' };
    }
    
    throw new UnauthorizedException('Credenciais inválidas');
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: string) {
    return this.userRepo.findOne({ where: { id }, relations: ['address', 'phones'] });
  }

  async remove(id: string) {
    await this.userRepo.delete(id);
    return { success: true };
  }
}
