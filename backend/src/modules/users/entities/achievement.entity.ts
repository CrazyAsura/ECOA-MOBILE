import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  xpReward: number;

  @Column({ nullable: true })
  iconName: string; // Nome do ícone do Lucide

  @Column({ nullable: true })
  frameReward: string; // URL da borda de quadro se houver

  @Column({ nullable: true })
  titleReward: string; // Título concedido se houver

  @ManyToMany(() => User)
  @JoinTable({ name: 'user_achievements' })
  users: User[];

  @CreateDateColumn()
  createdAt: Date;
}
