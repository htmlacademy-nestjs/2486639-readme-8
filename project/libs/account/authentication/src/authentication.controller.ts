import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, Param,
  Post, Req, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { BearerAuth, RequestWithTokenPayload, RouteAlias } from '@project/shared/core';
import { fillDto, getAuthorizationHeaderValue } from '@project/shared/helpers';
import { MongoIdValidationPipe } from '@project/shared/pipes';
import { RequestWithBlogUserEntity } from '@project/account/blog-user';

import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { UserTokenRdo } from './rdo/user-token.rdo';
import { TokenPayloadRdo } from './rdo/token-payload.rdo';
import { UserRdo } from './rdo/user.rdo';
import { UserIdApiParam, AuthenticationApiResponse, AvatarOption, parseFilePipeBuilder } from './authentication.constant';

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
    @Req() request: Request,
    @UploadedFile(parseFilePipeBuilder) avatarFile?: Express.Multer.File
  ): Promise<UserRdo> {
    // headers: Authorization - т.к. только анонимный пользователь может регистрироваться
    const newUser = await this.authService.registerUser(getAuthorizationHeaderValue(request), dto, avatarFile);

    return fillDto(UserRdo, newUser.toPOJO());
  }

  @ApiResponse(AuthenticationApiResponse.LoggedSuccess)
  @ApiResponse(AuthenticationApiResponse.LoggedError)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @UseGuards(LocalAuthGuard)
  @Post(RouteAlias.Login)
  public async login(
    @Body() _dto: LoginUserDto, // для swagger
    @Req() { user }: RequestWithBlogUserEntity
  ): Promise<LoggedUserRdo> {
    const userToken = await this.authService.createUserToken(user);

    return fillDto(LoggedUserRdo, { ...user.toPOJO(), ...userToken });
  }

  @ApiResponse(AuthenticationApiResponse.LogoutSuccess)
  @ApiBearerAuth(BearerAuth.RefreshToken)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(RouteAlias.Logout)
  public async logout(@Req() request: Request): Promise<void> {
    await this.authService.logout(getAuthorizationHeaderValue(request));
  }

  @ApiResponse(AuthenticationApiResponse.RefreshTokens)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.RefreshToken)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post(RouteAlias.Refresh)
  public async refreshToken(@Req() { user }: RequestWithBlogUserEntity): Promise<UserTokenRdo> {
    const userToken = await this.authService.createUserToken(user);

    return fillDto(UserTokenRdo, userToken);
  }

  @ApiResponse(AuthenticationApiResponse.CheckSuccess)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post(RouteAlias.Check)
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload): Promise<TokenPayloadRdo> {
    return fillDto(TokenPayloadRdo, payload);
  }

  @ApiResponse(AuthenticationApiResponse.ChangePasswordSuccess)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Post(RouteAlias.ChangePassword)
  public async changePassword(@Body() dto: ChangePasswordDto, @Req() { user }: RequestWithTokenPayload): Promise<void> {
    await this.authService.changeUserPassword(user.sub, dto.password);
  }

  @ApiResponse(AuthenticationApiResponse.UserFound)
  @ApiResponse(AuthenticationApiResponse.UserNotFound)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiParam(UserIdApiParam)
  @Get(`:${UserIdApiParam.name}`)
  public async show(@Param(UserIdApiParam.name, MongoIdValidationPipe) userId: string): Promise<UserRdo> {
    const existUser = await this.authService.getUser(userId);

    return fillDto(UserRdo, existUser.toPOJO());
  }
}
