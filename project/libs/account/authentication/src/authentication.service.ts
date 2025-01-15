import {
  ConflictException, ForbiddenException, HttpException, HttpStatus, Inject,
  Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { RouteAlias, Token, User } from '@project/shared/core';
import { createJWTPayload, makePath, parseAxiosError, uploadFile } from '@project/shared/helpers';
import { BlogUserRepository, BlogUserEntity } from '@project/account/blog-user';
import { applicationConfig, jwtConfig } from '@project/account/config';
import { NotifyService } from '@project/account/notify';
import { RefreshTokenService } from '@project/account/refresh-token';
import { FILE_KEY, UploadedFileRdo } from '@project/file-storage/file-uploader';

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
    private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    @Inject(applicationConfig.KEY)
    private readonly applicationOptions: ConfigType<typeof applicationConfig>,
    private readonly refreshTokenService: RefreshTokenService
  ) { }

  public async registerUser(authorizationHeader: string, dto: CreateUserDto, avatarFile?: Express.Multer.File): Promise<BlogUserEntity> {
    if (authorizationHeader) {
      throw new ForbiddenException(AuthenticationUserMessage.RequireLogout);
    }

    const { email, name, password } = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (existUser) {
      throw new ConflictException(AuthenticationUserMessage.Exists);
    }

    const blogUser = {
      email,
      name,
      avatarPath: '',
      passwordHash: ''
    };

    if (avatarFile) {
      try {
        const fileRdo = await uploadFile<UploadedFileRdo>(
          `${this.applicationOptions.fileStorageServiceUrl}/${RouteAlias.Upload}`,
          avatarFile,
          'FILE_KEY'
        );

        blogUser.avatarPath = makePath(fileRdo.subDirectory, fileRdo.hashName);
      } catch (error) {
        Logger.error(parseAxiosError(error), 'AuthenticationService.RegisterUser.FileUploadError');

        throw new InternalServerErrorException('File upload error!');
      }
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
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = { ...accessTokenPayload, tokenId: crypto.randomUUID() };

    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn
      });

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`[Token generation error]: ${error.message}`);

      throw new HttpException('Ошибка при создании токена.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUserByEmail(email: string) {
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return existUser;
  }
}
