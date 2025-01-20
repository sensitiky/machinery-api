import { Column, Entity, JoinTable, OneToMany } from 'typeorm';
import { Items } from './items';
import { BaseEntity } from './base';

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

  @OneToMany(() => Items, (item) => item.publisher)
  @JoinTable({
    name: 'publishedItems',
    joinColumn: { name: 'userID', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'itemID', referencedColumnName: 'id' },
  })
  items: Items[];
}
