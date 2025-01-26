import {
  Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, Query, Req,
  UploadedFile, UseFilters, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigType } from '@nestjs/config';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { join } from 'path/posix';

import {
  RequestWithRequestIdAndUserId, RouteAlias, PostWithUserRdo, PageQuery, ApiParamOption,
  BearerAuth, DetailPostWithUserIdRdo, DetailPostWithUserRdo, PostWithUserIdRdo, POST_ID_PARAM,
  PostWithUserAndPaginationRdo, PostWithUserIdAndPaginationRdo, RequestWithRequestId
} from '@project/shared/core';
import { makeHeaders, makeUrl } from '@project/shared/helpers';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';
import { GuidValidationPipe } from '@project/shared/pipes';
import { apiConfig } from '@project/api/config';
import {
  BaseBlogPostQuery, BlogPostApiResponse, CreatePostDto, ImageOption,
  parseFilePipeBuilder, SearchBlogPostQuery, TitleQuery, UpdatePostDto
} from '@project/blog/blog-post';

import { CheckAuthGuard } from './guards/check-auth.guard';
import { BlogService } from './blog.service';

@ApiTags('blog')
@Controller(join('blog', RouteAlias.Posts))
@UseFilters(AxiosExceptionFilter)
export class BlogPostController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>,
    private blogService: BlogService
  ) { }

  private getUrl(route = '', query: object = null): string {
    return makeUrl(this.apiOptions.blogPostServiceUrl, RouteAlias.Posts, route, query);
  }

  @ApiResponse({ ...BlogPostApiResponse.PostsFound, type: PostWithUserAndPaginationRdo })
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get('')
  public async index(@Query() query: SearchBlogPostQuery, @Req() { requestId }: RequestWithRequestId): Promise<PostWithUserAndPaginationRdo> {
    const url = this.getUrl('', query);
    const headers = makeHeaders(requestId);
    const { data } = await this.httpService.axiosRef.get<PostWithUserIdAndPaginationRdo>(url, headers);
    const newData = await this.blogService.fillUserOnPostPagination(data, requestId);

    return newData;
  }

  @ApiResponse({ ...BlogPostApiResponse.SearchPosts, type: PostWithUserRdo })
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get(RouteAlias.Search)
  public async find(@Query() titleQuery: TitleQuery, @Req() { requestId }: RequestWithRequestId): Promise<PostWithUserRdo[]> {
    const url = this.getUrl(RouteAlias.Search, titleQuery);
    const headers = makeHeaders(requestId);
    const { data: posts } = await this.httpService.axiosRef.get<PostWithUserIdRdo[]>(url, headers);
    const items = await this.blogService.fillUserOnPostArray(posts, requestId);

    return items;
  }

  @ApiResponse({ ...BlogPostApiResponse.PostsFound, type: PostWithUserAndPaginationRdo })
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Get(RouteAlias.MyPosts)
  public async getMyPosts(
    @Query() pageQuery: PageQuery,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<PostWithUserAndPaginationRdo> {
    const url = this.getUrl(RouteAlias.MyPosts, pageQuery);
    const headers = makeHeaders(requestId, null, userId);
    const { data } = await this.httpService.axiosRef.get<PostWithUserIdAndPaginationRdo>(url, headers);
    const newData = await this.blogService.fillUserOnPostPagination(data, requestId);

    return newData;
  }

  @ApiResponse({ ...BlogPostApiResponse.PostsFound, type: PostWithUserAndPaginationRdo })
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Get(RouteAlias.MyFeed)
  public async getMyFeed(
    @Query() query: BaseBlogPostQuery,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<PostWithUserAndPaginationRdo> {
    const url = this.getUrl(RouteAlias.MyFeed, query);
    const headers = makeHeaders(requestId, null, userId);
    const { data } = await this.httpService.axiosRef.get<PostWithUserIdAndPaginationRdo>(url, headers);
    const newData = await this.blogService.fillUserOnPostPagination(data, requestId);

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
    const url = this.getUrl(postId);
    const headers = makeHeaders(requestId, null, userId);
    const { data: post } = await this.httpService.axiosRef.get<DetailPostWithUserIdRdo>(url, headers);
    const postWithUser = this.blogService.fillUserOnPost(post, requestId);

    return postWithUser;
  }

  @ApiResponse({ ...BlogPostApiResponse.PostCreated, type: DetailPostWithUserRdo })
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileInterceptor(ImageOption.KEY))
  @Post()
  public async create(
    @Body() dto: CreatePostDto,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId,
    @UploadedFile(parseFilePipeBuilder) imageFile?: Express.Multer.File
  ): Promise<DetailPostWithUserRdo> {
    const post = await this.blogService.createOrUpdate(null, dto, requestId, userId, imageFile);

    return post;
  }

  @ApiResponse({ ...BlogPostApiResponse.PostUpdated, type: DetailPostWithUserRdo })
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(ApiParamOption.PostId)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileInterceptor(ImageOption.KEY))
  @Patch(POST_ID_PARAM)
  public async update(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Body() dto: UpdatePostDto,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId,
    @UploadedFile(parseFilePipeBuilder) imageFile?: Express.Multer.File
  ): Promise<DetailPostWithUserRdo> {
    const post = await this.blogService.createOrUpdate(postId, dto, requestId, userId, imageFile);

    return post;
  }

  @ApiResponse({ ...BlogPostApiResponse.PostReposted, type: DetailPostWithUserRdo })
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.AlreadyReposted)
  @ApiParam(ApiParamOption.PostId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Post(join(RouteAlias.Repost, POST_ID_PARAM))
  public async repost(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<DetailPostWithUserRdo> {
    const url = this.getUrl(join(RouteAlias.Repost, postId));
    const headers = makeHeaders(requestId, null, userId);
    const { data: post } = await this.httpService.axiosRef.post<DetailPostWithUserIdRdo>(url, null, headers);
    const postWithUser = this.blogService.fillUserOnPost(post, requestId);

    return postWithUser;
  }

  @ApiResponse(BlogPostApiResponse.PostDeleted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(ApiParamOption.PostId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @HttpCode(BlogPostApiResponse.PostDeleted.status)
  @Delete(POST_ID_PARAM)
  public async delete(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<void> {
    const url = this.getUrl(postId);
    const headers = makeHeaders(requestId, null, userId);

    await this.httpService.axiosRef.delete(url, headers);
  }
}
