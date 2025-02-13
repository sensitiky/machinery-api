import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Seller } from '../entities/seller';

export class CreateItemDto {
  @IsNotEmpty()
  title: string;
  @IsNumber()
  @IsNotEmpty()
  price?: number;
  @IsOptional()
  description?: string;
  @IsOptional()
  image?: string;
  seller: Seller;
}
export class UpdateItemDto {
  title?: string;
  description?: string;
  seller: Seller;
}
