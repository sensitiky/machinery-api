import { IsNotEmpty, IsOptional } from 'class-validator';

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
export class UpdateDTO {
  @IsNotEmpty()
  id: number;
  @IsOptional()
  name: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  email: string;

  @IsOptional()
  password: string;
}
