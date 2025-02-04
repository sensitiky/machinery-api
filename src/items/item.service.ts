import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto, UpdateItemDto } from '../common/dtos/item.dto';
import { Item } from '../common/entities/item';

@Injectable()
export class ItemsService {
  private readonly logger = new ConsoleLogger();
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = this.itemsRepository.create({
      ...createItemDto,
      seller: { id: createItemDto.seller.id },
    });
    return this.itemsRepository.save(item);
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
    return this.itemsRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
  }
  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    await this.itemsRepository.update(id, updateItemDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.itemsRepository.delete(id);
  }
}
