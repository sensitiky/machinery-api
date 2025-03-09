import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateItemAdmindDto,
  CreateItemDto,
  UpdateItemDto,
} from '../common/dtos/item.dto';
import { Item } from '../common/entities/item';
import { Seller } from '../common/entities/seller';
import { CloudinaryService } from './cloudinary.service';
import { User } from '../common/entities/user';

@Injectable()
export class ItemsService {
  private readonly logger = new ConsoleLogger();
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createAdminWithImage(
    createItemDto: CreateItemAdmindDto,
    files?: Express.Multer.File[],
  ): Promise<Item> {
    let imageUrls: string[] | [];

    if (files) {
      imageUrls = await this.cloudinaryService.uploadMultipleImages(files);
    }
    const sellerData = {
      email: createItemDto['seller.email'],
      username: createItemDto['seller.username'],
    };
    let seller = await this.sellerRepository.findOne({
      where: { email: sellerData.email },
    });

    if (!seller) {
      seller = this.sellerRepository.create(sellerData);
      seller = await this.sellerRepository.save(seller);
    }

    const item = this.itemsRepository.create({
      ...createItemDto,
      imageUrls,
      seller,
    });

    return await this.itemsRepository.save(item);
  }
  async createWithImage(
    createItemDto: CreateItemDto,
    files?: Express.Multer.File[],
  ): Promise<Item> {
    try {
      let imageUrls: string[] | [];

      if (files) {
        imageUrls = await this.cloudinaryService.uploadMultipleImages(files);
      }
      const user = await this.userRepository.findOne({
        where: { email: createItemDto.seller.email },
        relations: ['seller'],
      });
      if (!user) throw new NotFoundException('User not found');
      let seller = user.seller;
      if (!seller) {
        seller = this.sellerRepository.create({
          username: user.username,
          email: user.email,
          user: user,
        });
        seller = await this.sellerRepository.save(seller);
      }

      const item = this.itemsRepository.create({
        ...createItemDto,
        imageUrls,
        seller,
      });

      return await this.itemsRepository.save(item);
    } catch (error) {
      this.logger.error('Error creating item with image:', error);
      throw error;
    }
  }
  async switchToFeatured(itemId: number, isFeatured: boolean): Promise<Item> {
    try {
      const item = await this.itemsRepository.findOne({
        where: { id: itemId },
      });
      item.isFeatured = isFeatured;
      return await this.itemsRepository.save(item);
    } catch (error) {
      this.logger.error(error);
    }
  }
  async findAll(
    page: number,
    take: number,
  ): Promise<{ items: Item[]; total: number }> {
    const skip = (page - 1) * take;
    const [items, total] = await this.itemsRepository.findAndCount({
      order: { createdAt: 'desc' },
      relations: ['seller'],
      take: take,
      skip: skip,
    });
    return {
      items,
      total,
    };
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
  async getCategories(): Promise<string[]> {
    const categories = await this.itemsRepository.find({
      select: ['category'],
    });
    const uniqueCategories = Array.from(
      new Set(categories.map((category) => category.category).filter(Boolean)),
    );
    return uniqueCategories.length > 0 ? uniqueCategories : [];
  }
  async findFeatured(): Promise<Item[] | null> {
    try {
      const items = await this.itemsRepository.find({
        where: { isFeatured: true },
        order: { createdAt: 'desc' },
        relations: ['seller'],
      });
      return items;
    } catch (error) {
      this.logger.error(error);
    }
  }
  async findRecommendation(category: string, exclude: number): Promise<Item[]> {
    if (isNaN(exclude)) {
      this.logger.error(`Invalid exclude ID: ${exclude}`);
      throw new Error('Invalid exclude ID');
    }

    try {
      const recommendation = await this.itemsRepository.find({
        where: { category: category, id: Not(exclude) },
        take: 4,
        cache: true,
      });
      return recommendation;
    } catch (error) {
      this.logger.error(`Error finding recommendations: ${error.message}`);
      throw new Error('Error finding recommendations');
    }
  }
  async findOne(id: number): Promise<Item> {
    if (isNaN(id)) {
      this.logger.error(`Invalid ID: ${id}`);
      throw new Error('Invalid item ID');
    }

    try {
      const response = await this.itemsRepository.findOne({
        where: { id },
        relations: ['seller', 'seller.items'],
      });

      if (!response) {
        throw new Error(`Item with ID ${id} not found`);
      }

      return response;
    } catch (error) {
      this.logger.error(`Error finding item with ID ${id}: ${error.message}`);
      throw error;
    }
  }
  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    if (isNaN(id)) {
      this.logger.error(`Invalid ID: ${id}`);
      throw new Error('Invalid item ID');
    }

    try {
      await this.itemsRepository.update(id, updateItemDto);
      return this.findOne(id);
    } catch (error) {
      this.logger.error(`Error updating item with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      this.logger.error(`Invalid ID: ${id}`);
      throw new Error('Invalid item ID');
    }

    try {
      await this.itemsRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting item with ID ${id}: ${error.message}`);
      throw error;
    }
  }
  async search(query: string): Promise<Item[]> {
    const response = await this.itemsRepository.find({
      where: { title: ILike(`%${query}%`) },
      relations: ['seller'],
    });
    return response;
  }
}
