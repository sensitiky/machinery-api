import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../common/entities/user';
import { CreateUserDto, UpdateUserDto } from '../common/dtos/user.dto';
import { Seller } from '../common/entities/seller';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.roles || createUserDto.roles.length === 0) {
      createUserDto.roles =
        createUserDto.email === 'mariomcorrea3@gmail.com'
          ? ['admin']
          : ['guest'];
    }

    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    // Create associated seller
    const seller = this.sellerRepository.create({
      username: user.username,
      email: user.email,
      user: user,
    });
    await this.sellerRepository.save(seller);

    return this.findByEmail(user.email);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email: email },
      relations: ['seller', 'seller.items'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
