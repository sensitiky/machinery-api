import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { Item } from '@/entities/items';

@Controller()
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  async getAll() {
    return await this.userService.getAll();
  }

  @Post('/user')
  async getOne(@Body() userID: number) {
    const response = await this.userService.getOne(userID);
    return response;
  }
  @Post('/userByItems')
  async getUserByItems(@Body() items: Array<Item>) {
    const response = await this.userService.getUserByItems(items);
    return response;
  }
}
