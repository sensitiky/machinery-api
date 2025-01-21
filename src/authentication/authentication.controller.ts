import {
  Body,
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Headers,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDTO, RegisterDTO, UpdateDTO } from '../common/dtos/user.dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    try {
      const response = await this.authService.register(registerDTO);
      return response;
    } catch (error) {
      return { status: 500, message: 'User cannot be created' };
    }
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    try {
      const response = await this.authService.login(loginDTO);
      return response;
    } catch (error) {
      return { status: 500, message: 'Login failed' };
    }
  }

  @Put('update')
  async update(
    @Headers('Authorization') token: string,
    @Body() updateDTO: UpdateDTO,
  ) {
    try {
      const response = await this.authService.update(
        token.replace('Bearer ', ''),
        updateDTO,
      );
      return response;
    } catch (error) {
      return { status: 500, message: 'Update failed' };
    }
  }

  @Delete('delete/:id')
  async delete(
    @Param('id') userId: number,
  ): Promise<{ status: HttpStatus; message: string }> {
    try {
      const response = await this.authService.delete(userId);
      if (response === 404) {
        return { status: 404, message: 'User not found' };
      }
      return { status: 200, message: 'User deleted successfully' };
    } catch (error) {
      return { status: 500, message: 'Deletion failed' };
    }
  }
}
