import { HttpService } from '@nestjs/axios';
import { Body, Controller, Inject, Post, Req, UseFilters } from '@nestjs/common';

import { LoginUserDto } from '@project/account/authentication';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { apiConfig } from '@project/api/config';
import { ConfigType } from '@nestjs/config';

@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const url = `${this.apiOptions.account.serviceUrl}/${this.apiOptions.account.authRoute}/login`;
    const { data } = await this.httpService.axiosRef.post(url, loginUserDto);

    return data;
  }

  @Post('refresh')
  public async refreshToken(@Req() req: Request) {
    const url = `${this.apiOptions.account.serviceUrl}/${this.apiOptions.account.authRoute}/refresh`;
    const { data } = await this.httpService.axiosRef.post(url, null, {
      headers: { 'Authorization': req.headers['authorization'] }
    });

    return data;
  }
}
