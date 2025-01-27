import {
  ConflictException, ForbiddenException, HttpException, HttpStatus, Inject,
  Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path/posix';

import { RouteAlias, Token, User } from '@project/shared/core';
import { createJWTPayload, parseAxiosError, uploadFile } from '@project/shared/helpers';
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

  public async registerUser(
    authorizationHeader: string,
    dto: CreateUserDto,
    requestId: string,
    avatarFile?: Express.Multer.File
  ): Promise<BlogUserEntity> {
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
          join(this.applicationOptions.fileStorageServiceUrl, RouteAlias.Upload),
          avatarFile,
          FILE_KEY,
          requestId
        );
        const { subDirectory, hashName } = fileRdo

        blogUser.avatarPath = join(subDirectory, hashName);
      } catch (error) {
        this.logger.error(`RegisterUser.FileUploadError: ${parseAxiosError(error)}`);

        throw new InternalServerErrorException('File upload error!');
      }
    }

    const userEntity = new BlogUserEntity(blogUser);

    await userEntity.setPassword(password);
    await this.blogUserRepository.save(userEntity);

    await this.notifyService.registerSubscriber({ email, name }, requestId);

    return userEntity;
  }

  public async changeUserPassword(email: string, oldPassword: string, newPassword: string): Promise<void> {
    const userEntity = await this.verifyUser({ email, password: oldPassword });

    await userEntity.setPassword(newPassword);
    await this.blogUserRepository.update(userEntity);
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
      this.logger.error(`Token generation error: ${error.message}`);

      throw new HttpException('Ошибка при создании токена.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async logout(authorizationHeader: string): Promise<void> {
    if (!authorizationHeader) {
      return;
    }

    this.logger.log('AuthenticationService.logout');
    // доделать позже проверить, что это refreh token... удалить его ...refreshTokenService.deleteRefreshSession...
  }


  public async getUser(id: string): Promise<BlogUserEntity> {
    const user = await this.blogUserRepository.findById(id);

    if (!user) {
      throw new NotFoundException(AuthenticationUserMessage.NotFound);
    }

    return user;
  }

  public async getUserByEmail(email: string) {
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return existUser;
  }

  public async verifyUser(dto: LoginUserDto): Promise<BlogUserEntity> {
    const { email, password } = dto;
    const existUser = await this.getUserByEmail(email);

    const isCorrectPassword = await existUser.comparePassword(password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException(AuthenticationUserMessage.WrongPassword);
    }

    return existUser;
  }
}
