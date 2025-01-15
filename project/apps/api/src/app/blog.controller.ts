import { Body, Controller, Inject, Post, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { apiConfig } from '@project/api/config';
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
  //! временно
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async create(@Body() dto: any) {
    const url = `${this.apiOptions.blogPostServiceUrl}/`;
    const { data } = await this.httpService.axiosRef.post(url, dto);

    return data;
  }
}
