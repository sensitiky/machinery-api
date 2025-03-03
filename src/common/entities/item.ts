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
  category: string;
  @Column({ nullable: true })
  location: string;
  @Column({ nullable: true })
  condition: string;
  @Column({ nullable: true })
  year: number;
  @Column('text', { array: true, nullable: true, default: [] })
  imageUrls: string[];
  @Column({ default: false })
  isFeatured: boolean;
  @ManyToOne(() => Seller, (seller) => seller.items)
  seller: Relation<Seller>;
}
