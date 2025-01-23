import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { Role } from './role';
import { Item } from './item';

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Item, (item) => item.publisher)
  @JoinTable({
    name: 'publishedItems',
    joinColumn: { name: 'userID', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'itemID', referencedColumnName: 'id' },
  })
  items: Item[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'userRoles',
    joinColumn: {
      name: 'userID',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleID',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
