import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Complaint } from '../../complaints/entities/complaint.entity';
import { UserGender, UserEthnicity, UserRole } from '../enums/user.enums';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  realName: string;

  @Column({ nullable: true })
  identity: string;

  @Column({
    type: 'simple-enum',
    enum: UserGender,
    default: UserGender.OUTRO,
  })
  gender: UserGender;

  @Column({
    type: 'simple-enum',
    enum: UserEthnicity,
    default: UserEthnicity.PARDA,
  })
  ethnicity: UserEthnicity;

  @Column({ type: 'date', nullable: true })
  birthDate: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

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

  @Column('simple-json', { nullable: true })
  address: {
    zipCode: string;
    street: string;
    city: string;
    state: string;
    district: string;
    country: string;
    number: string;
  };

  @Column('simple-json', { nullable: true })
  phones: {
    ddi: string;
    ddd: string;
    number: string;
  }[];

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Complaint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
