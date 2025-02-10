import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { ItemsService } from './item.service';
import { CreateItemDto, UpdateItemDto } from '../common/dtos/item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // Anyone can view items
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }
  @Get('latest')
  async findLatest() {
    return await this.itemsService.findLatest();
  }

  @Get('featured')
  async findFeatured() {
    return await this.itemsService.findFeatured();
  }
  @Get('search')
  async searchItems(@Query('query') query: string) {
    return this.itemsService.search(query);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.itemsService.findOne(+id);
  }

  // Only admin and user roles can create/update/delete items
  @Post()
  @Roles('admin', 'user')
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
