import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '@/entities/items';
import { User } from '@/entities/user';
import { In, Repository } from 'typeorm';
import { mapUserToInterface } from '@/mappers/entities.mapper';
import { IUser } from '@/interfaces/user.interface';

export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async getOne(userID: number): Promise<IUser | HttpStatus> {
    try {
      const user = await this.userRepository.findOneBy({ id: userID });
      if (!user) throw HttpStatus.NOT_FOUND;
      mapUserToInterface(user);
      return user;
    } catch (error) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
  async getUserByItems(items: Array<Item>): Promise<IUser[] | HttpStatus> {
    try {
      const itemIDs = items.map((item) => item.id);
      const foundItems = await this.itemRepository.findBy({ id: In(itemIDs) });
      if (foundItems.length === 0) return HttpStatus.NOT_FOUND;
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.items', 'item')
        .where('item.id(:...itemIDs)', { itemIDs })
        .getMany();
      const user = users.map((user) => mapUserToInterface(user));
      return user;
    } catch (error) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
