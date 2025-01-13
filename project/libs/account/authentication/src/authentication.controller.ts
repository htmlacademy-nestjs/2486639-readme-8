import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RequestWithTokenPayload } from '@project/shared/core';
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
import { UserIdApiParam, AuthenticationApiResponse } from './authentication.constant';

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
  @Post('register')
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.registerUser(dto);

    return fillDto(UserRdo, newUser.toPOJO());
  }

  @ApiResponse(AuthenticationApiResponse.LoggedSuccess)
  @ApiResponse(AuthenticationApiResponse.LoggedError)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBody({ type: LoginUserDto, required: true })
  @UseGuards(LocalAuthGuard)
  @Post('login')
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
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  public async refreshToken(@Req() { user }: RequestWithBlogUserEntity) {
    const userToken = await this.authService.createUserToken(user);

    return fillDto(UserTokenRdo, userToken);
  }

  @ApiResponse(AuthenticationApiResponse.CheckSuccess)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('check')
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return fillDto(TokenPayloadRdo, payload);
  }
}
