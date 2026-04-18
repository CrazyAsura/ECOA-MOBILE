import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Address } from '../modules/addresses/entities/address.entity';
import { Phone } from '../modules/phones/entities/phone.entity';
import { Complaint } from '../modules/complaints/entities/complaint.entity';
import { ForumPost } from '../modules/forum/entities/forum-post.entity';
import { Course } from '../modules/courses/entities/course.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🚀 Iniciando Mega Seeding ECOA...');

  const userRepo = dataSource.getRepository(User);
  const complaintRepo = dataSource.getRepository(Complaint);
  const forumRepo = dataSource.getRepository(ForumPost);
  const courseRepo = dataSource.getRepository(Course);

  // 1. Limpeza total (Ordem correta para evitar erros de FK)
  await dataSource.getRepository(Phone).delete({});
  await dataSource.getRepository(Address).delete({});
  await dataSource.getRepository(ForumPost).delete({});
  await dataSource.getRepository(Course).delete({});
  await dataSource.getRepository(Complaint).delete({});
  await dataSource.getRepository(User).delete({});

  // 2. Criar Usuário Admin com Endereço e Telefone
  const adminData: any = {
    email: 'admin@ecoa.app',
    password: 'password123',
    realName: 'Matheus Leon',
    identity: '123.456.789-00',
    gender: 'Masculino',
    ethnicity: 'Pardo',
    birthDate: new Date('1995-10-25'),
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
      title: 'Descarte em Terreno Baldio', 
      description: 'Acúmulo de entulho e lixo eletrônico atraindo roedores.',
      location: 'Rua das Flores, 450',
      status: 'pending',
      isPublic: false,
      user: admin
    },
    { 
      title: 'Poluição Rio Pinheiros', 
      description: 'Mancha de óleo detectada perto da ponte.',
      location: 'Marginal Pinheiros',
      status: 'analyzing',
      isPublic: true,
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
