import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  category: string; // ex: 'Hidrologia', 'Reciclagem', 'Legislação'

  @Column()
  level: string; // 'Iniciante', 'Intermediário', 'Avançado'

  @Column()
  duration: string;

  @Column()
  modulesCount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
