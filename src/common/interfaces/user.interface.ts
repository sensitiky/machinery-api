import { Item } from '@/src/common/entities/item';
import { Role } from '@/entities/role';

export interface IUser {
  id: number;
  name: string;
  lastName: string;
  username: string;
  email: string;
  items: Item[];
  roles: Role[];
}
