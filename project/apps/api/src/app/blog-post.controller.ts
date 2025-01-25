import { Controller, Get, Inject, Param, Query, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';

import { apiConfig } from '@project/api/config';
import {
  ApiParamOption, BearerAuth, DetailPostWithUserIdRdo, DetailPostWithUserRdo, PageQuery,
  POST_ID_PARAM, PostWithUserAndPaginationRdo, PostWithUserIdAndPaginationRdo, PostWithUserIdRdo, PostWithUserRdo, RequestWithRequestId,
  RequestWithRequestIdAndUserId, RouteAlias
} from '@project/shared/core';
import { fillDto, getQueryString, makeHeaders } from '@project/shared/helpers';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';
import { GuidValidationPipe } from '@project/shared/pipes';
import { BaseBlogPostQuery, BlogPostApiResponse, SearchBlogPostQuery, TitleQuery } from '@project/blog/blog-post';

import { CheckAuthGuard } from './guards/check-auth.guard';
import { UserService } from './user.service';

@ApiTags('blog-post')
@Controller('blog-posts')
@UseFilters(AxiosExceptionFilter)
export class BlogPostController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>,
    private userService: UserService
  ) { }

  @ApiResponse({ ...BlogPostApiResponse.PostsFound, type: PostWithUserAndPaginationRdo })
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get('/')
  public async index(@Query() query: SearchBlogPostQuery, @Req() { requestId }: RequestWithRequestId): Promise<PostWithUserAndPaginationRdo> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}${getQueryString(query)}`;
    const { data } = await this.httpService.axiosRef.get<PostWithUserIdAndPaginationRdo>(url, makeHeaders(requestId));
    const newData = await this.userService.fillUser(data, requestId);

    return newData;
  }

  @ApiResponse({ ...BlogPostApiResponse.SearchPosts, type: PostWithUserRdo })
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get(`/${RouteAlias.Search}`)
  public async find(@Query() titleQuery: TitleQuery, @Req() { requestId }: RequestWithRequestId): Promise<PostWithUserRdo[]> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}/${RouteAlias.Search}${getQueryString(titleQuery)}`;
    const { data: posts } = await this.httpService.axiosRef.get<PostWithUserIdRdo[]>(url, makeHeaders(requestId));
    const items = await this.userService.replaceUserIdOnUser(posts, requestId);

    return items;
  }

  @ApiResponse({ ...BlogPostApiResponse.PostsFound, type: PostWithUserAndPaginationRdo })
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Get(`/${RouteAlias.MyPosts}`)
  public async getMyPosts(
    @Query() pageQuery: PageQuery,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<PostWithUserAndPaginationRdo> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}/${RouteAlias.MyPosts}${getQueryString(pageQuery)}`;
    const { data } = await this.httpService.axiosRef.get<PostWithUserIdAndPaginationRdo>(url, makeHeaders(requestId, null, userId));
    const newData = await this.userService.fillUser(data, requestId);

    return newData;
  }

  @ApiResponse({ ...BlogPostApiResponse.PostsFound, type: PostWithUserAndPaginationRdo })
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Get(`/${RouteAlias.MyFeed}`)
  public async getMyFeed(
    @Query() query: BaseBlogPostQuery,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<PostWithUserAndPaginationRdo> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}/${RouteAlias.MyFeed}${getQueryString(query)}`;
    const { data } = await this.httpService.axiosRef.get<PostWithUserIdAndPaginationRdo>(url, makeHeaders(requestId, null, userId));
    const newData = await this.userService.fillUser(data, requestId);

    return newData;
  }

  @ApiResponse({ ...BlogPostApiResponse.PostFound, type: DetailPostWithUserRdo })
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiParam(ApiParamOption.PostId)
  @Get(POST_ID_PARAM)
  public async show(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<DetailPostWithUserRdo> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}/${postId}`;
    const { data: post } = await this.httpService.axiosRef.get<DetailPostWithUserIdRdo>(url, makeHeaders(requestId, null, userId));
    const user = await this.userService.getUser(post.userId, requestId);

    return fillDto(DetailPostWithUserRdo, { ...post, user });
  }
}
