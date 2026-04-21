import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email', 'password'] as const)) {
  @IsString()
  @IsOptional()
  activeTitle?: string;

  @IsString()
  @IsOptional()
  avatarFrame?: string;

  @IsNumber()
  @IsOptional()
  xp?: number;

  @IsNumber()
  @IsOptional()
  level?: number;

  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;
}
