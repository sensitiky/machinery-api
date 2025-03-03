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
        take: 3,
      });
      return items;
    } catch (error) {
      this.logger.error(error);
    }
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
    try {
      const recommendation = await this.itemsRepository.find({
        where: { category: category, id: Not(exclude) },
        take: 4,
        cache: true,
      });
      return recommendation;
    } catch (e) {
      this.logger.error(e);
      throw new Error('Error finding recommendations');
    }
  }
  async findOne(id: number): Promise<Item> {
    const response = await this.itemsRepository.findOne({
      where: { id },
      relations: ['seller', 'seller.items'],
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
