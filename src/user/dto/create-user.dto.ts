import { IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}