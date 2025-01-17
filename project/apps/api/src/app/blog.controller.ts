import { Body, Controller, Inject, Post, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { apiConfig } from '@project/api/config';
import { RequestWithRequestIdAndUserId, XHeader } from '@project/shared/core';
import { InjectUserIdInterceptor } from '@project/shared/interceptors';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';

import { CheckAuthGuard } from './guards/check-auth.guard';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdInterceptor)
  @Post('/')
  //! временно, пока нет dto
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async create(@Body() dto: any, @Req() { userId, requestId }: RequestWithRequestIdAndUserId) {
    const url = `${this.apiOptions.blogPostServiceUrl}/`;
    const { data } = await this.httpService.axiosRef.post(url, dto, { headers: { [XHeader.RequestId]: requestId, [XHeader.UserId]: userId } });

    return data;
  }
}
