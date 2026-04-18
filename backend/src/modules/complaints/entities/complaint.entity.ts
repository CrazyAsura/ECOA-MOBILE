import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { EncryptionTransformer } from '@/common/utils/crypto.util';
import { User } from '../../users/entities/user.entity';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'text',
    transformer: EncryptionTransformer,
  })
  description: string;

  @Column({
    type: 'text',
    transformer: EncryptionTransformer,
  })
  location: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: true })
  isPublic: boolean;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
