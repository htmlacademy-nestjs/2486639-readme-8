import { Body, Controller, Get, Inject, Post, Query, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';

import { apiConfig } from '@project/api/config';
import { RequestWithRequestId, RequestWithRequestIdAndUserId, RouteAlias } from '@project/shared/core';
import { getQueryString, makeHeaders } from '@project/shared/helpers';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';
import { BlogPostApiResponse, PostRdo, PostWithPaginationRdo, SearchBlogPostQuery, TitleQuery } from '@project/blog/blog-post';

import { CheckAuthGuard } from './guards/check-auth.guard';

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
  public async index(@Query() query: SearchBlogPostQuery, @Req() { requestId }: RequestWithRequestId): Promise<PostWithPaginationRdo> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}${getQueryString(query)}`;
    const { data } = await this.httpService.axiosRef.get<PostWithPaginationRdo>(url, makeHeaders(requestId));

    return data;
  }

  @ApiResponse(BlogPostApiResponse.SearchPosts)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get(`/${RouteAlias.Search}`)
  public async find(@Query() titleQuery: TitleQuery, @Req() { requestId }: RequestWithRequestId): Promise<PostRdo[]> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}/${RouteAlias.Search}${getQueryString(titleQuery)}`;
    const { data } = await this.httpService.axiosRef.get<PostRdo[]>(url, makeHeaders(requestId));

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
