import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Validate user credentials
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Login method
  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
      seller: user.seller
        ? {
            id: user.seller.id,
            name: user.seller.name,
            email: user.seller.email,
            items: user.seller.items,
          }
        : null,
    };
    return this.jwtService.sign(payload);
  }

  // Registration method (for simplicity, delegates to UsersService)
  async register(userData: any) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    const { password, ...result } = newUser;
    return result;
  }
}
