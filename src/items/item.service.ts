import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '@/common/entities/item';
import { CreateItemDTO, UpdateItemDTO } from '@/common/dtos/item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}

  async addItem(createItemDTO: CreateItemDTO): Promise<Item> {
    try {
      const newItem = this.itemRepository.create(createItemDTO);
      return await this.itemRepository.save(newItem);
    } catch (error) {
      throw new Error('Failed to add item');
    }
  }

  async updateItem(id: number, updateItemDTO: UpdateItemDTO): Promise<Item> {
    try {
      await this.itemRepository.update(id, updateItemDTO);
      return await this.itemRepository.findOneBy({ id });
    } catch (error) {
      throw new Error('Failed to update item');
    }
  }

  async deleteItem(id: number): Promise<void> {
    try {
      const item = await this.itemRepository.findOneBy({ id });
      if (!item) throw new Error('Item not found');
      await this.itemRepository.delete(id);
    } catch (error) {
      throw new Error('Failed to delete item');
    }
  }

  async getItem(id: number): Promise<Item> {
    try {
      const item = await this.itemRepository.findOneBy({ id });
      if (!item) throw new Error('Item not found');
      return item;
    } catch (error) {
      throw new Error('Failed to retrieve item');
    }
  }

  async getAllItems(): Promise<Item[]> {
    try {
      return await this.itemRepository.find();
    } catch (error) {
      throw new Error('Failed to retrieve items');
    }
  }
}
