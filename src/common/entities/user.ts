import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from './base';
import { Seller } from './seller';

@Entity()
export class User extends BaseEntity {
  @Column()
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column('text', { array: true, default: () => "ARRAY['guest']" })
  roles: string[];
  @OneToOne(() => Seller, (seller) => seller.user)
  seller: Seller;
}
