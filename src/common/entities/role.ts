import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user';

@Entity()
export class Role extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
