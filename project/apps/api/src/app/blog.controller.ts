import { Body, Controller, Inject, Post, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { apiConfig } from '@project/api/config';
import { InjectUserIdInterceptor } from '@project/shared/interceptors';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';

import { CheckAuthGuard } from './guards/check-auth.guard';
import { RequestProperty, XHeader } from '@project/shared/core';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {

  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  //@UseGuards(CheckAuthGuard) //! временно выключил
  //@UseInterceptors(InjectUserIdInterceptor)
  @Post('/')
  //! временно
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async create(@Body() dto: any, @Req() request: Request) {
    const url = `${this.apiOptions.blogPostServiceUrl}/`;
    const { data } = await this.httpService.axiosRef.post(url, dto, { headers: { [XHeader.RequestId]: request[RequestProperty.RequestId] } });

    return data;
  }
}
