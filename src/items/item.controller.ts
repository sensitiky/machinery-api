import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { ItemsService } from './item.service';
import { CreateItemAdmindDto, UpdateItemDto } from '../common/dtos/item.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ) {
    return this.itemsService.findAll(page, take);
  }
  @Get('latest')
  async findLatest() {
    return await this.itemsService.findLatest();
  }

  @Get('featured')
  async findFeatured() {
    return await this.itemsService.findFeatured();
  }
  @Get('recommendations')
  async findRecommendations(
    @Query('category') category: string,
    @Query('exclude') exclude: number,
  ) {
    return await this.itemsService.findRecommendation(category, exclude);
  }
  @Get('search')
  async searchItems(@Query('query') query: string) {
    return this.itemsService.search(query);
  }
  @Post('publish')
  @UseInterceptors(FilesInterceptor('files', 8))
  async createWithImage(
    @Body() body: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const createItemDto =
      typeof body.data === 'string' ? JSON.parse(body.data) : body.data;
    return this.itemsService.createWithImage(createItemDto, files);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.itemsService.findOne(+id);
  }

  // Only admin and user roles can create/update/delete items
  @Post()
  @Roles('admin', 'user')
  @UseInterceptors(FilesInterceptor('files', 8))
  async create(
    @Body() createItemDto: CreateItemAdmindDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return await this.itemsService.createAdminWithImage(createItemDto, files);
  }
  @Post('featured')
  @Roles('admin')
  async switchToFeatured(
    @Body() body: { itemId: number; isFeatured: boolean },
  ) {
    return await this.itemsService.switchToFeatured(
      body.itemId,
      body.isFeatured,
    );
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
