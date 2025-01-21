import { User } from '@/entities/user';
import { IUser } from '@/interfaces/user.interface';

export function mapUserToInterface(user: User): IUser {
  return {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    items: user.items,
    roles: user.roles,
  };
}
