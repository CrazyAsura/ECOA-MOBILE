import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';
import * as argon2 from 'argon2';
import { Address } from '../../addresses/entities/address.entity';
import { Phone } from '../../phones/entities/phone.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  realName: string;

  @Column({ nullable: true })
  identity: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  ethnicity: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  // Gamificação
  @Column({ default: 0 })
  xp: number;

  @Column({ default: 1 })
  level: number;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ nullable: true })
  activeTitle: string;

  @Column({ nullable: true })
  avatarFrame: string;

  @OneToOne(() => Address, { cascade: true, eager: true })
  @JoinColumn()
  address: Address;

  @OneToMany(() => Phone, (phone) => phone.user, { cascade: true, eager: true })
  phones: Phone[];

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password);
    }
  }
}
