import { Controller, Get, Inject, Param, Query, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';

import { apiConfig } from '@project/api/config';
import {
  ApiParamOption, BearerAuth, DetailPostWithUserRdo, POST_ID_PARAM,
  RequestWithRequestId, RequestWithRequestIdAndUserId, RouteAlias
} from '@project/shared/core';
import { getQueryString, makeHeaders } from '@project/shared/helpers';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';
import { GuidValidationPipe } from '@project/shared/pipes';
import {
  BaseBlogPostQuery, BlogPostApiResponse, PageQuery, PostRdo,
  PostWithPaginationRdo, SearchBlogPostQuery, TitleQuery
} from '@project/blog/blog-post';

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

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Get(`/${RouteAlias.MyPosts}`)
  public async getMyPosts(
    @Query() pageQuery: PageQuery,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<PostWithPaginationRdo> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}/${RouteAlias.MyPosts}${getQueryString(pageQuery)}`;
    const { data } = await this.httpService.axiosRef.get<PostWithPaginationRdo>(url, makeHeaders(requestId, null, userId));

    return data;
  }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Get(`/${RouteAlias.MyFeed}`)
  public async getMyFeed(
    @Query() query: BaseBlogPostQuery,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<PostWithPaginationRdo> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}/${RouteAlias.MyFeed}${getQueryString(query)}`;
    const { data } = await this.httpService.axiosRef.get<PostWithPaginationRdo>(url, makeHeaders(requestId, null, userId));

    return data;
  }

  @ApiResponse(BlogPostApiResponse.PostFound)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiParam(ApiParamOption.PostId)
  @Get(POST_ID_PARAM)
  public async show(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<DetailPostWithUserRdo> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}/${postId}`;
    const { data } = await this.httpService.axiosRef.get<DetailPostWithUserRdo>(url, makeHeaders(requestId, null, userId));

    return { ...data, user: { id: '111', name: 'aaa', email: 'ssss', avatarPath: '/sads/as', registrationDate: '2025-01-01' } }; //! временно
  }
}
