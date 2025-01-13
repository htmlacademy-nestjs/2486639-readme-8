import {
  ConflictException, HttpException, HttpStatus, Inject, Injectable,
  Logger, NotFoundException, UnauthorizedException
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Token, TokenPayload, User } from '@project/shared/core';
import { BlogUserRepository, BlogUserEntity } from '@project/account/blog-user';
import { NotifyService } from '@project/account/notify';
import { jwtConfig } from '@project/account/config';

import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticationUserMessage } from './authentication.constant';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly jwtService: JwtService,
    private readonly notifyService: NotifyService,
    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>
  ) { }

  public async registerUser(dto: CreateUserDto): Promise<BlogUserEntity> {
    const { email, name, password } = dto;

    const blogUser = {
      email,
      name,
      avatar: '',
      passwordHash: ''
    };

    const existUser = await this.blogUserRepository.findByEmail(email);

    if (existUser) {
      throw new ConflictException(AuthenticationUserMessage.Exists);
    }

    const userEntity = new BlogUserEntity(blogUser);

    await userEntity.setPassword(password);
    await this.blogUserRepository.save(userEntity);

    await this.notifyService.registerSubscriber({ email, name });

    return userEntity;
  }

  public async verifyUser(dto: LoginUserDto): Promise<BlogUserEntity> {
    const { email, password } = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(AuthenticationUserMessage.NotFound);
    }

    const isCorrectPassword = await existUser.comparePassword(password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException(AuthenticationUserMessage.WrongPassword);
    }

    return existUser;
  }

  public async getUser(id: string): Promise<BlogUserEntity> {
    const user = await this.blogUserRepository.findById(id);

    if (!user) {
      throw new NotFoundException(AuthenticationUserMessage.NotFound);
    }

    return user;
  }

  public async createUserToken(user: User): Promise<Token> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name
    };

    try {
      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn
      });

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('[Token generation error]: ' + error.message);

      throw new HttpException('Ошибка при создании токена.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
