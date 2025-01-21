import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../common/entities/user';
import { Repository } from 'typeorm';
import { LoginDTO, RegisterDTO, UpdateDTO } from '../common/dtos/user.dto';
import { mapUserToInterface } from '../common/mappers/entities.mapper';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../common/interfaces/user.interface';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDTO: RegisterDTO,
  ): Promise<{ status: HttpStatus; data: IUser; token: string } | HttpStatus> {
    try {
      const user = await this.userRepository.findOneBy({ id: registerDTO.id });
      if (user) return HttpStatus.CONFLICT;
      const newUser = this.userRepository.create(registerDTO);
      const hashedPassword = await bcrypt.hash(newUser.password, 12);
      newUser.password = hashedPassword;
      await this.userRepository.save(newUser);

      const payload = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      };

      const token = await this.jwtService.signAsync(payload);
      const response = mapUserToInterface(newUser);

      return { status: HttpStatus.OK, data: response, token: token };
    } catch (error) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async login(
    loginDTO: LoginDTO,
  ): Promise<
    | { status: HttpStatus; message: string; data?: IUser; token?: string }
    | HttpStatus
  > {
    try {
      const identifier = loginDTO.email || loginDTO.username;
      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { username: identifier }],
      });
      if (user && bcrypt.compare(loginDTO.password, user.password)) {
        const payload = {
          id: user.id,
          username: user.username,
          email: user.email,
        };

        const token = await this.jwtService.signAsync(payload);
        const response = mapUserToInterface(user);
        return {
          status: HttpStatus.OK,
          message: 'Login successfully',
          data: response,
          token: token,
        };
      }
      return { status: HttpStatus.NOT_FOUND, message: 'User not found' };
    } catch (e) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async update(
    token: string,
    updateDTO: UpdateDTO,
  ): Promise<
    | { status: HttpStatus; message: string; data: IUser; token: string }
    | HttpStatus
  > {
    try {
      const tokenValidation = await this.jwtService.verifyAsync(token);

      if (!tokenValidation) return HttpStatus.UNAUTHORIZED;

      const user = await this.userRepository.findOneBy({ id: updateDTO.id });
      if (!user) return HttpStatus.NOT_FOUND;

      if (user) {
        await this.userRepository.update(updateDTO.id, updateDTO);

        const updatedUser = mapUserToInterface(user);
        const payload = {
          id: user.id,
          username: user.username,
          email: user.email,
        };
        const newToken = await this.jwtService.signAsync(payload);

        return {
          status: HttpStatus.ACCEPTED,
          message: 'User updated successfully',
          data: updatedUser,
          token: newToken,
        };
      }
    } catch (error) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  async delete(
    userId: number,
  ): Promise<{ status: HttpStatus; message: string } | HttpStatus> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) return HttpStatus.NOT_FOUND;

      await this.userRepository.delete(userId);
      return { status: HttpStatus.OK, message: 'User deleted succesfully' };
    } catch (error) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
