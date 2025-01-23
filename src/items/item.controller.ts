import {
  Body,
  Controller,
  Post,
  Put,
  Delete,
  Param,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDTO, UpdateItemDTO } from '../common/dtos/item.dto';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('add')
  async addItem(@Body() createItemDTO: CreateItemDTO) {
    try {
      const response = await this.itemService.addItem(createItemDTO);
      return { status: HttpStatus.CREATED, data: response };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Put('update/:id')
  async updateItem(
    @Param('id') id: number,
    @Body() updateItemDTO: UpdateItemDTO,
  ) {
    try {
      const response = await this.itemService.updateItem(id, updateItemDTO);
      return { status: HttpStatus.OK, data: response };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Delete('delete/:id')
  async deleteItem(@Param('id') id: number) {
    try {
      await this.itemService.deleteItem(id);
      return { status: HttpStatus.OK, message: 'Item deleted successfully' };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Get(':id')
  async getItem(@Param('id') id: number) {
    try {
      const response = await this.itemService.getItem(id);
      return { status: HttpStatus.OK, data: response };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Get()
  async getAllItems() {
    try {
      const response = await this.itemService.getAllItems();
      return { status: HttpStatus.OK, data: response };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
