import { Body, Controller, Inject, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiTags } from '@nestjs/swagger';

import { RequestWithTokenPayload, RouteAlias } from '@project/shared/core';
import { apiConfig } from '@project/api/config';
import { CreateUserDto, LoginUserDto } from '@project/account/authentication';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';

@ApiTags('users')
@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  @Post(RouteAlias.Register)
  public async register(@Body() dto: CreateUserDto) {
    const url = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Register}`;
    const { data } = await this.httpService.axiosRef.post(url, dto);

    return data;
  }

  @Post(RouteAlias.Login)
  public async login(@Body() dto: LoginUserDto) {
    const url = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Login}`;
    const { data } = await this.httpService.axiosRef.post(url, dto);

    return data;
  }

  @Post(RouteAlias.Refresh)
  public async refreshToken(@Req() req: Request) {
    const url = `${this.apiOptions.accountServiceUrl}/refresh`;
    const { data } = await this.httpService.axiosRef.post(url, null, {
      headers: { 'Authorization': req.headers['authorization'] }
    });

    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post(RouteAlias.Check)
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }
}
