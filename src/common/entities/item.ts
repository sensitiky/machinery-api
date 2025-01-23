import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user';

@Entity('items')
export class Item extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  publisher: User;
}
