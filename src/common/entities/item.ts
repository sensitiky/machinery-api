import { Entity, Column, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from './base';
import { Seller } from './seller';

@Entity()
export class Item extends BaseEntity {
  @Column()
  title: string;
  @Column({ nullable: true })
  price: number;
  @Column({ nullable: true })
  description: string;
  @ManyToOne(() => Seller, (seller) => seller.products)
  seller: Relation<Seller>;
}
