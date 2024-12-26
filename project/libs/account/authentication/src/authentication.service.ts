import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { BlogUserRepository, BlogUserEntity } from '@project/account/blog-user';
import { mongoDbConfig } from '@project/account/config'

import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticationUserMessage } from './authentication.constant';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly blogUserRepository: BlogUserRepository,

    @Inject(mongoDbConfig.KEY)
    private readonly databaseConfig: ConfigType<typeof mongoDbConfig>
  ) { }

  public async register(dto: CreateUserDto): Promise<BlogUserEntity> {
    const { email, login, password } = dto;

    const blogUser = {
      email,
      login,
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

    return userEntity;
  }

  public async verifyUser(dto: LoginUserDto) {
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

  public async getUser(id: string) {
    const user = await this.blogUserRepository.findById(id);

    if (!user) {
      throw new NotFoundException(AuthenticationUserMessage.NotFound);
    }

    return user;
  }
}
