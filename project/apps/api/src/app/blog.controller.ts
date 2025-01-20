import { Body, Controller, Inject, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';

import { apiConfig } from '@project/api/config';
import { RequestWithRequestIdAndUserId, RouteAlias, XHeader } from '@project/shared/core';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';

import { CheckAuthGuard } from './guards/check-auth.guard';

@ApiTags('blog')
@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  @UseGuards(CheckAuthGuard)
  @Post('/')
  //! временно, пока нет dto
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async create(@Body() dto: any, @Req() { userId, requestId }: RequestWithRequestIdAndUserId) {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}`;
    const { data } = await this.httpService.axiosRef.post(url, dto, { headers: { [XHeader.RequestId]: requestId, [XHeader.UserId]: userId } });

    return data;
  }
}
