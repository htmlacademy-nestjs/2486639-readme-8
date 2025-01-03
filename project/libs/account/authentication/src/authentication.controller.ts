import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';

import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
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
  @Post('register')
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.register(dto);

    return fillDto(UserRdo, newUser.toPOJO());
  }

  @ApiResponse(AuthenticationApiResponse.LoggedSuccess)
  @ApiResponse(AuthenticationApiResponse.LoggedError)
  @Post('login')
  public async login(@Body() dto: LoginUserDto) {
    const verifiedUser = await this.authService.verifyUser(dto);

    return fillDto(LoggedUserRdo, verifiedUser.toPOJO());
  }

  @ApiResponse(AuthenticationApiResponse.UserFound)
  @ApiResponse(AuthenticationApiResponse.UserNotFound)
  @ApiParam(UserIdApiParam)
  @Get(`:${UserIdApiParam.name}`)
  public async show(@Param(UserIdApiParam.name) userId: string) {
    const existUser = await this.authService.getUser(userId);

    return fillDto(UserRdo, existUser.toPOJO());
  }
}
