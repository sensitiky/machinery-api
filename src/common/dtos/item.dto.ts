import {
  IsAlphanumeric,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
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
  @IsArray()
  image?: string[];
  @IsAlphanumeric()
  condition: string;
  seller: Seller;
}
export class CreateItemAdmindDto {
  @IsNotEmpty()
  title: string;
  @IsNumber()
  @IsNotEmpty()
  price?: number;
  @IsOptional()
  description?: string;
  @IsOptional()
  @IsArray()
  image?: string[];
  @IsAlphanumeric()
  condition: string;
  isFeatured: boolean;
  'seller.email': string;
  'seller.username': string;
}
export class UpdateItemDto {
  title?: string;
  description?: string;
  seller: Seller;
}
