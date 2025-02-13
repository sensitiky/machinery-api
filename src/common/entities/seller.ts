import {
  Entity,
  Column,
  Relation,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base';
import { Item } from './item';
import { User } from './user';

@Entity()
export class Seller extends BaseEntity {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: Relation<User>;

  @OneToMany(() => Item, (item) => item.seller)
  items: Relation<Item[]>;
}
