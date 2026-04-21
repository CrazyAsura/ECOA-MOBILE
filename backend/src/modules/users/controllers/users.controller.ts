import { Controller, Get, Post, Patch, Body, Param, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  login(@Body() credentials: { email: string; password: string }) {
    return this.usersService.login(credentials);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile/:id')
  @ApiOperation({ summary: 'Obter perfil e gamificação do usuário' })
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Get('reward-pass/levels')
  @ApiOperation({ summary: 'Obter níveis do Passe de Recompensas' })
  getRewardPass() {
    return [
      { level: 1, free: 'Título: Iniciante', premium: 'Borda: Neon Verde', unlocked: true },
      { level: 2, free: '50 XP', premium: '200 XP', unlocked: true },
      { level: 3, free: 'Ícone: Árvore', premium: 'Título: Eco-Guerreiro', unlocked: true },
      { level: 4, free: '100 XP', premium: 'Borda: Ouro Reciclado', unlocked: false },
      { level: 5, free: 'Título: Defensor', premium: 'Título: Protetor da Terra', unlocked: false },
      { level: 6, free: '200 XP', premium: '500 XP', unlocked: false },
    ];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do usuário' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
