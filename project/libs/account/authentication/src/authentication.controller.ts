import {
  Body, Controller, Get, HttpCode, HttpStatus, Param,
  ParseFilePipeBuilder, Post, Req, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BearerAuth, RequestWithTokenPayload, RouteAlias } from '@project/shared/core';
import { fillDto } from '@project/shared/helpers';
import { MongoIdValidationPipe } from '@project/shared/pipes';
import { RequestWithBlogUserEntity } from '@project/account/blog-user';

import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { UserTokenRdo } from './rdo/user-token.rdo';
import { TokenPayloadRdo } from './rdo/token-payload.rdo';
import { UserRdo } from './rdo/user.rdo';
import { UserIdApiParam, AuthenticationApiResponse, AvatarOption, UserValidation } from './authentication.constant';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService
  ) { }

  @ApiResponse(AuthenticationApiResponse.UserCreated)
  @ApiResponse(AuthenticationApiResponse.UserExist)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.NotAllow)
  @ApiBearerAuth(BearerAuth.AccessToken) // для тестирования - анонимный пользователь может регистрироваться
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor(AvatarOption.KEY))
  @Post(RouteAlias.Register)
  public async register(
    @Body() dto: CreateUserDto,
    @Req() req: Request,
    @UploadedFile(
      //AvatarOption.KEY, ! avatarFile - undefined
      new ParseFilePipeBuilder()
        .addFileTypeValidator(UserValidation.AvatarFile.Type)
        .addMaxSizeValidator(UserValidation.AvatarFile.MaxSize)
        .build(UserValidation.AvatarFile.Build)) avatarFile?: Express.Multer.File) {
    // headers: Authorization - т.к. только анонимный пользователь может регистрироваться
    const newUser = await this.authService.registerUser(req.headers['authorization'], dto, avatarFile);

    return fillDto(UserRdo, newUser.toPOJO());
  }

  @ApiResponse(AuthenticationApiResponse.LoggedSuccess)
  @ApiResponse(AuthenticationApiResponse.LoggedError)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBody({ type: LoginUserDto, required: true })
  @UseGuards(LocalAuthGuard)
  @Post(RouteAlias.Login)
  public async login(@Req() { user }: RequestWithBlogUserEntity) {
    const userToken = await this.authService.createUserToken(user);

    return fillDto(LoggedUserRdo, { ...user.toPOJO(), ...userToken });
  }

  @ApiResponse(AuthenticationApiResponse.UserFound)
  @ApiResponse(AuthenticationApiResponse.UserNotFound)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiParam(UserIdApiParam)
  @Get(`:${UserIdApiParam.name}`)
  public async show(@Param(UserIdApiParam.name, MongoIdValidationPipe) userId: string) {
    const existUser = await this.authService.getUser(userId);

    return fillDto(UserRdo, existUser.toPOJO());
  }

  @ApiResponse(AuthenticationApiResponse.RefreshTokens)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth(BearerAuth.RefreshToken)
  @UseGuards(JwtRefreshGuard)
  @Post(RouteAlias.Refresh)
  public async refreshToken(@Req() { user }: RequestWithBlogUserEntity) {
    const userToken = await this.authService.createUserToken(user);

    return fillDto(UserTokenRdo, userToken);
  }

  @ApiResponse(AuthenticationApiResponse.CheckSuccess)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(JwtAuthGuard)
  @Post(RouteAlias.Check)
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return fillDto(TokenPayloadRdo, payload);
  }
}
