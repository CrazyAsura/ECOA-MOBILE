import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
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

    try {
      const hashedPassword = await argon2.hash(dto.password);
      const user = this.userRepo.create({
        ...dto,
        password: hashedPassword,
      });
      return await this.userRepo.save(user);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    Object.assign(user, dto);
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

  async login(credentials: { email: string; password: string }) {
    const user = await this.userRepo.findOne({
      where: { email: credentials.email.trim().toLowerCase() }
    });

    if (user) {
      try {
        const isPasswordValid = await argon2.verify(user.password, credentials.password);
        if (isPasswordValid) {
          // Retorna o usuário sem a senha
          const { password, ...safeUser } = user as any;
          return { user: safeUser, token: 'mock-jwt-token' };
        }
      } catch (error) {
        console.error('Erro na verificação de senha:', error);
      }
    }

    throw new UnauthorizedException('Credenciais inválidas');
  }

  findAll() {
    return this.userRepo.find({ select: ['id', 'email', 'realName', 'level', 'xp', 'role', 'createdAt'] });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async getProfile(id: string) {
    const user = await this.findOne(id);

    const unlockedItems: any[] = [
      { id: '1', name: 'Título Iniciante', type: 'title', value: 'Eco-Iniciante' },
    ];
    if (user.level >= 2) unlockedItems.push({ id: '2', name: 'Sentinela', type: 'title', value: 'Sentinela da Natureza' });
    if (user.level >= 3) {
      unlockedItems.push({ id: '3', name: 'Mestre', type: 'title', value: user.activeTitle || 'Mestre da Reciclagem' });
      unlockedItems.push({ id: 'frame-gold', name: 'Borda Ouro', type: 'frame', value: 'https://i.ibb.co/L5TFrv7/eco-frame-gold.png' });
    }

    const { password, ...safeUser } = user as any;
    return { ...safeUser, unlockedItems };
  }

  async remove(id: string) {
    await this.userRepo.delete(id);
    return { success: true };
  }
}
