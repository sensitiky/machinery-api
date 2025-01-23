export class CreateItemDTO {
  title: string;
  description: string;
  price: number;
  publisherId: number;
}

export class UpdateItemDTO {
  title?: string;
  description?: string;
  price?: number;
}
