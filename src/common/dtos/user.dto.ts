import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsOptional()
  roles?: string[];
}

export class RegisterDTO {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class LoginDTO {
  @IsOptional()
  username: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
export class UpdateUserDto {
  @IsOptional()
  username?: string;
  @IsOptional()
  password?: string;

  @IsOptional()
  roles?: string[];
}
