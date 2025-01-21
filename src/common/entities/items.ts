import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user';
import { BaseEntity } from './base';

@Entity('items')
export class Item extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToOne(() => User, (user) => user.items)
  publisher: User;
}
