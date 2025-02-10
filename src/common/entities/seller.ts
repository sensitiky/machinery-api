import { Entity, Column, OneToMany, Relation, JoinTable } from 'typeorm';
import { BaseEntity } from './base';
import { Item } from './item';

@Entity()
export class Seller extends BaseEntity {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @JoinTable({
    name: 'itemSeller',
    joinColumn: { name: 'sellerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'itemId', referencedColumnName: 'id' },
  })
  products: Relation<Item[]>;
}
