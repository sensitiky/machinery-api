import {
  Controller,
  Get,
  Param,
  Query,
  Body,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { IUser } from '@/interfaces/user.interface';
import { Item } from '@/src/common/entities/item';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Obtener todos los usuarios
  @Get()
  async getAllUsers(): Promise<IUser[]> {
    return await this.userService.getAll();
  }

  // Obtener un usuario por su ID
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<IUser | HttpStatus> {
    return await this.userService.getOne(id);
  }

  // Filtrar usuarios por campos específicos
  @Get('filter')
  async filterUsers(
    @Query()
    query: Partial<{
      id: number;
      name: string;
      lastName: string;
      username: string;
      email: string;
    }>,
  ): Promise<IUser[] | HttpStatus> {
    return await this.userService.filterUsersByFields(query);
  }

  // Buscar usuarios relacionados con items
  @Post('items')
  async getUsersByItems(@Body() items: Item[]): Promise<IUser[] | HttpStatus> {
    return await this.userService.getUsersByItems(items);
  }

  // Buscar usuarios que coincidan con un array de datos
  @Post('match')
  async matchUsersByArray(
    @Body('dataArray') dataArray: string[],
  ): Promise<IUser[] | HttpStatus> {
    return await this.userService.matchUsersByArray(dataArray);
  }
}
