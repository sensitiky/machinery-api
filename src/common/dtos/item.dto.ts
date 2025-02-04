import { Seller } from '../entities/seller';

export class CreateItemDto {
  title: string;
  price?: number;
  description?: string;
  seller: Seller;
}
export class UpdateItemDto {
  title?: string;
  description?: string;
  seller: Seller;
}
