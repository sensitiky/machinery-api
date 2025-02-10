import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto, UpdateItemDto } from '../common/dtos/item.dto';
import { Item } from '../common/entities/item';
import { Seller } from '../common/entities/seller';

@Injectable()
export class ItemsService {
  private readonly logger = new ConsoleLogger();
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,

    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    let seller = await this.sellerRepository.findOne({
      where: { email: createItemDto.seller.email },
    });

    if (!seller) {
      seller = this.sellerRepository.create(createItemDto.seller);
      seller = await this.sellerRepository.save(seller);
    }

    const item = this.itemsRepository.create({
      ...createItemDto,
      seller,
    });

    return await this.itemsRepository.save(item);
  }

  async findAll(orderBy: 'asc' | 'desc' = 'asc'): Promise<Item[]> {
    return this.itemsRepository.find({
      order: { createdAt: orderBy },
      relations: ['seller'],
    });
  }
  async findLatest(): Promise<Item[]> {
    try {
      const items = await this.itemsRepository.find({
        order: { createdAt: 'desc' },
        relations: ['seller'],
      });
      return items;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findFeatured(): Promise<Item[] | null> {
    try {
      const items = await this.itemsRepository.find({
        order: { createdAt: 'desc' },
        relations: ['seller'],
      });
      return items;
    } catch (error) {
      this.logger.error(error);
    }
  }
  async findOne(id: number): Promise<Item> {
    const response = await this.itemsRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
    return response;
  }
  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    await this.itemsRepository.update(id, updateItemDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.itemsRepository.delete(id);
  }
  async search(query: string): Promise<Item[]> {
    const response = await this.itemsRepository.find({
      where: { title: ILike(`%${query}%`) },
      relations: ['seller'],
    });
    return response;
  }
}
