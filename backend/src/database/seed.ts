import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Address } from '../modules/addresses/entities/address.entity';
import { Phone } from '../modules/phones/entities/phone.entity';
import { Complaint } from '../modules/complaints/entities/complaint.entity';
import { ForumPost } from '../modules/forum/entities/forum-post.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { UserGender, UserEthnicity, UserRole } from '../modules/users/enums/user.enums';
import { PollutionType, ComplaintStatus } from '../modules/complaints/enums/complaint.enums';
import * as argon2 from 'argon2';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🚀 Iniciando Mega Seeding ECOA...');

  const userRepo = dataSource.getRepository(User);
  const complaintRepo = dataSource.getRepository(Complaint);
  const forumRepo = dataSource.getRepository(ForumPost);
  const courseRepo = dataSource.getRepository(Course);

  // 1. Limpeza total (Ordem correta para evitar erros de FK)
  await dataSource.getRepository(Phone).createQueryBuilder().delete().execute();
  await dataSource.getRepository(Address).createQueryBuilder().delete().execute();
  await dataSource.getRepository(ForumPost).createQueryBuilder().delete().execute();
  await dataSource.getRepository(Course).createQueryBuilder().delete().execute();
  await dataSource.getRepository(Complaint).createQueryBuilder().delete().execute();
  await dataSource.getRepository(User).createQueryBuilder().delete().execute();

  // 2. Criar Usuário Admin com Endereço e Telefone
  const hashedPassword = await argon2.hash('password123');
  const adminData: any = {
    email: 'admin@ecoa.app',
    password: hashedPassword,
    realName: 'Matheus Leon',
    identity: '123.456.789-00',
    gender: UserGender.MASCULINO,
    ethnicity: UserEthnicity.PARDA,
    birthDate: '1995-10-25',
    role: UserRole.ADMIN,
    xp: 2500,
    level: 3,
    activeTitle: 'Mestre da Reciclagem',
    avatarFrame: 'https://i.ibb.co/L5TFrv7/eco-frame-gold.png',
    address: {
      zipCode: '01001-000',
      street: 'Praça da Sé',
      number: '123',
      district: 'Centro',
      city: 'São Paulo',
      state: 'SP'
    },
    phones: [
      { ddi: '+55', ddd: '11', number: '98888-8888' }
    ]
  };
  
  const admin = userRepo.create(adminData);
  await userRepo.save(admin);
  console.log('👤 Usuário Admin e registros vinculados criados.');

  // 3. Criar Queixas
  await complaintRepo.save([
    { 
      type: PollutionType.URBANO, 
      description: 'Acúmulo de entulho e lixo eletrônico atraindo roedores.',
      location: 'Rua das Flores, 450',
      status: ComplaintStatus.PENDENTE,
      user: admin
    },
    { 
      type: PollutionType.AGUA, 
      description: 'Mancha de óleo detectada perto da ponte.',
      location: 'Marginal Pinheiros',
      status: ComplaintStatus.EM_ANALISE,
      user: admin
    }
  ] as any);

  // 4. Criar Posts do Fórum
  await forumRepo.save([
    { 
      userName: 'Matheus Leon', 
      content: 'Como posso denunciar uma queimada de forma anônima?', 
      category: 'Dúvida',
      likes: 12, dislikes: 1, views: 45 
    }
  ] as any);

  // 5. Criar Cursos
  await courseRepo.save([
    { 
      title: 'Introdução à Reciclagem', 
      level: 'Iniciante', 
      modulesCount: 6, 
      duration: '1h 20m', 
      category: 'Resíduos',
      description: 'Aprenda os conceitos básicos.'
    }
  ] as any);

  console.log('✨ Mega Seeding Finalizado!');
  await app.close();
}

bootstrap().catch(err => {
  console.error('❌ Erro no seeding:', err);
  process.exit(1);
});
