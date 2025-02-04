import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base';

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
}
