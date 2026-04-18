import { IsEmail, IsString, MinLength, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Matheus Leon' })
  @IsString()
  realName: string;

  @ApiProperty({ example: 'Masc' })
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  birthDate: string;

  @IsOptional()
  address?: any;

  @IsOptional()
  phones?: any[];
}
