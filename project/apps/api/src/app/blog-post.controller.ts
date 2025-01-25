import { Body, Controller, Get, Inject, Post, Query, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';

import { apiConfig } from '@project/api/config';
import { RequestWithRequestId, RequestWithRequestIdAndUserId, RouteAlias } from '@project/shared/core';
import { makeHeaders } from '@project/shared/helpers';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';

import { CheckAuthGuard } from './guards/check-auth.guard';
import { BlogPostApiResponse, PostWithPaginationRdo, SearchBlogPostQuery } from '@project/blog/blog-post';

@ApiTags('blog-post')
@Controller('blog-posts')
@UseFilters(AxiosExceptionFilter)
export class BlogPostController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get('/')
  public async index(@Query() query: SearchBlogPostQuery, @Req() { requestId }: RequestWithRequestId, @Req() request: Request): Promise<PostWithPaginationRdo> {
    console.log(query); //!
    console.log(request)

    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}`; //! query -> ?...string
    const { data } = await this.httpService.axiosRef.get<PostWithPaginationRdo>(url, makeHeaders(requestId));

    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post('/')
  //! временно, пока нет dto
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async create(@Body() dto: any, @Req() { requestId, userId }: RequestWithRequestIdAndUserId) {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}`;
    const { data } = await this.httpService.axiosRef.post(url, dto, makeHeaders(requestId, null, userId));

    return data;
  }
}
