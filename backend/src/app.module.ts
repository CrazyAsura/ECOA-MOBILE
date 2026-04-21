import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './database/database-config.service';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { UsersModule } from './modules/users/users.module';
import { ForumModule } from './modules/forum/forum.module';
import { CoursesModule } from './modules/courses/courses.module';
import { RedisModule } from './modules/redis/redis.module';
import { AIModule } from './modules/ai/ai.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
    }),
    RedisModule,
    UsersModule,
    ComplaintsModule,
    ForumModule,
    CoursesModule,
    AIModule,
    NotificationsModule,
  ],
})
export class AppModule {}
