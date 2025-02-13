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
  @Column({ nullable: true })
  imageUrl: string;
  @ManyToOne(() => Seller, (seller) => seller.items)
  seller: Relation<Seller>;
}
