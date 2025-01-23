import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Item } from '@/src/common/entities/item';
import { User } from '@/entities/user';
import { mapUserToInterface } from '@/mappers/entities.mapper';
import { IUser } from '@/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}

  // Obtener todos los usuarios
  async getAll(): Promise<IUser[]> {
    const users = await this.userRepository.find();
    return users.map((user) => mapUserToInterface(user));
  }

  // Obtener un usuario por su ID
  async getOne(userID: number): Promise<IUser | HttpStatus> {
    try {
      const user = await this.userRepository.findOneBy({ id: userID });
      if (!user) return HttpStatus.NOT_FOUND;
      return mapUserToInterface(user);
    } catch (error) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  // Filtrar usuarios por campos específicos
  async filterUsersByFields(
    filters: Partial<
      Pick<User, 'id' | 'name' | 'lastName' | 'username' | 'email'>
    >,
  ): Promise<IUser[] | HttpStatus> {
    try {
      const users = await this.userRepository.find({
        where: filters,
      });
      if (users.length === 0) return HttpStatus.NOT_FOUND;
      return users.map((user) => mapUserToInterface(user));
    } catch (error) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  // Buscar usuarios asociados a ciertos items
  async getUsersByItems(items: Item[]): Promise<IUser[] | HttpStatus> {
    try {
      const itemIDs = items.map((item) => item.id);
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.items', 'item')
        .where('item.id IN (:...itemIDs)', { itemIDs })
        .getMany();
      if (users.length === 0) return HttpStatus.NOT_FOUND;
      return users.map((user) => mapUserToInterface(user));
    } catch (error) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  // Verificar si algún campo de un array de datos coincide con un usuario
  async matchUsersByArray(dataArray: string[]): Promise<IUser[] | HttpStatus> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.name IN (:...dataArray)', { dataArray })
        .orWhere('user.lastName IN (:...dataArray)', { dataArray })
        .orWhere('user.username IN (:...dataArray)', { dataArray })
        .orWhere('user.email IN (:...dataArray)', { dataArray })
        .getMany();
      if (users.length === 0) return HttpStatus.NOT_FOUND;
      return users.map((user) => mapUserToInterface(user));
    } catch (error) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
