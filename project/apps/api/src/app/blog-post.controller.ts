import {
  Body, Controller, Get, Inject, Param, Post, Query, Req,
  UploadedFile, UseFilters, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigType } from '@nestjs/config';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';

import { apiConfig } from '@project/api/config';
import {
  RequestWithRequestIdAndUserId, RouteAlias, PostWithUserRdo, PageQuery, ApiParamOption,
  BearerAuth, DetailPostWithUserIdRdo, DetailPostWithUserRdo, PostWithUserIdRdo, POST_ID_PARAM,
  PostWithUserAndPaginationRdo, PostWithUserIdAndPaginationRdo, RequestWithRequestId
} from '@project/shared/core';
import { dtoToFormData, fillDto, getQueryString, makeHeaders, multerFileToFormData } from '@project/shared/helpers';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';
import { GuidValidationPipe } from '@project/shared/pipes';
import {
  BaseBlogPostQuery, BlogPostApiResponse, CreatePostDto, ImageOption,
  parseFilePipeBuilder, SearchBlogPostQuery, TitleQuery
} from '@project/blog/blog-post';

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
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}`;
    const formData = new FormData();

    dtoToFormData(dto, formData);

    if (imageFile) {
      multerFileToFormData(imageFile, formData, ImageOption.KEY);
    }

    const { data: post } = await this.httpService.axiosRef.post<DetailPostWithUserIdRdo>(url, formData, makeHeaders(requestId, null, userId));
    const user = await this.userService.getUser(post.userId, requestId);

    return fillDto(DetailPostWithUserRdo, { ...post, user });
  }

  /*
  @ApiResponse(BlogPostApiResponse.PostUpdated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(ApiParamOption.PostId)
  @ApiConsumes('multipart/form-data')
  @ApiHeader(ApiHeaderOption.RequestId)
  @UseInterceptors(FileInterceptor(ImageOption.KEY))
  @Patch(POST_ID_PARAM)
  public async update(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Body() dto: UpdatePostDto,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId,
    @UploadedFile(parseFilePipeBuilder) imageFile?: Express.Multer.File
  ): Promise<DetailPostWithUserIdRdo> {
    const updatedPost = await this.blogPostService.updatePost(postId, dto, imageFile, userId, requestId);

    return fillDto(DetailPostWithUserIdRdo, updatedPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostReposted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.AlreadyReposted)
  @ApiParam(ApiParamOption.PostId)
  @Post(`/${RouteAlias.Repost}/${POST_ID_PARAM}`)
  public async repost(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<DetailPostWithUserIdRdo> {
    const repostedPost = await this.blogPostService.repostPost(postId, userId);

    return fillDto(DetailPostWithUserIdRdo, repostedPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostDeleted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(ApiParamOption.PostId)
  @HttpCode(BlogPostApiResponse.PostDeleted.status)
  @Delete(POST_ID_PARAM)
  public async delete(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogPostService.deletePost(postId, userId);
  }

  @ApiResponse(BlogPostApiResponse.UserPostsCount)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @ApiParam(ApiParamOption.UserId)
  @Get(`/${RouteAlias.GetUserPostsCount}/${USER_ID_PARAM}`)
  public async getUserPostsCount(@Param(ApiParamOption.UserId.name, MongoIdValidationPipe) userId: string): Promise<UserPostsCountRdo> {
    const postsCount = await this.blogPostService.getUserPostsCount(userId);

    return fillDto(UserPostsCountRdo, { userId, postsCount });
  }
  */
}
