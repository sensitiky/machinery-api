import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Local login endpoint (using username & password)
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return { user: user, access_token: await this.authService.login(user) };
  }

  // Registration endpoint
  @Post('register')
  async register(
    @Body() body: { username: string; password: string; roles?: string[] },
  ) {
    return this.authService.register(body);
  }
}
