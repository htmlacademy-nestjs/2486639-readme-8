import {
  Body, Controller, Delete, Get, HttpCode, Param, Patch,
  Post, Query, Req, UploadedFile, UseInterceptors
} from '@nestjs/common';
import { ApiConsumes, ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { fillDto } from '@project/shared/helpers';
import {
  ApiParamOption, RequestWithRequestIdAndUserId, RequestWithUserId, RouteAlias,
  USER_ID_PARAM, POST_ID_PARAM, ApiHeaderOption, DetailPostWithUserIdRdo, PageQuery,
  PostWithUserIdAndPaginationRdo,
  PostWithUserIdRdo
} from '@project/shared/core';
import { GuidValidationPipe, MongoIdValidationPipe } from '@project/shared/pipes';

import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserPostsCountRdo } from './rdo/user-posts-count.rdo';
import { TitleQuery } from './query/title.query';
import { BaseBlogPostQuery } from './query/base-blog-post.query';
import { SearchBlogPostQuery } from './query/search-blog-post.query';
import { BlogPostApiResponse, ImageOption, parseFilePipeBuilder } from './blog-post.constant';

@ApiTags('blog-post')
@ApiHeader(ApiHeaderOption.UserId) // глобально вроде не добавить? и примеры почемуто не работают...
@Controller(RouteAlias.Posts)
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  private async getPostsWithPagination(
    query: SearchBlogPostQuery,
    checkAuthorization = false,
    currentUserId?: string,
    showDraft = false
  ): Promise<PostWithUserIdAndPaginationRdo> {
    const postsWithPagination = await this.blogPostService.getAllPosts(query, currentUserId, checkAuthorization, showDraft);
    const result = {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map((post) => post.toPOJO())
    }

    return fillDto(PostWithUserIdAndPaginationRdo, result);
  }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get('/')
  public async index(@Query() query: SearchBlogPostQuery): Promise<PostWithUserIdAndPaginationRdo> {
    const posts = await this.getPostsWithPagination(query);

    return posts;
  }

  @ApiResponse(BlogPostApiResponse.SearchPosts)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get(`/${RouteAlias.Search}`)
  public async find(@Query() { title }: TitleQuery): Promise<PostWithUserIdRdo[]> {
    const postEntities = await this.blogPostService.findPostsByTitle(title);

    return postEntities.map((postEntity) => fillDto(PostWithUserIdRdo, postEntity.toPOJO()));
  }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @Get(`/${RouteAlias.MyPosts}`)
  public async getMyPosts(
    @Query() { page }: PageQuery,
    @Req() { userId }: RequestWithUserId
  ): Promise<PostWithUserIdAndPaginationRdo> {
    const query: SearchBlogPostQuery = { userId, page };
    const posts = await this.getPostsWithPagination(query, true, userId);

    return posts;
  }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @Get(`/${RouteAlias.MyDtafts}`)
  public async getMyDrafts(
    @Query() { page }: PageQuery,
    @Req() { userId }: RequestWithUserId
  ): Promise<PostWithUserIdAndPaginationRdo> {
    const query: SearchBlogPostQuery = { userId, page };
    const posts = await this.getPostsWithPagination(query, true, userId, true);

    return posts;
  }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @Get(`/${RouteAlias.MyFeed}`)
  public async getMyFeed(
    @Query() query: BaseBlogPostQuery,
    @Req() { userId }: RequestWithUserId
  ): Promise<PostWithUserIdAndPaginationRdo> {
    const postsWithPagination = await this.blogPostService.getFeed(query, userId);
    const result = {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map((post) => post.toPOJO())
    }

    return fillDto(PostWithUserIdAndPaginationRdo, result);
  }

  @ApiResponse(BlogPostApiResponse.PostFound)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiParam(ApiParamOption.PostId)
  @Get(POST_ID_PARAM)
  public async show(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<DetailPostWithUserIdRdo> {
    const existPost = await this.blogPostService.getPost(postId, userId);

    return fillDto(DetailPostWithUserIdRdo, existPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostCreated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @ApiConsumes('multipart/form-data')
  @ApiHeader(ApiHeaderOption.RequestId)
  @UseInterceptors(FileInterceptor(ImageOption.KEY))
  @Post()
  public async create(
    @Body() dto: CreatePostDto,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId,
    @UploadedFile(parseFilePipeBuilder) imageFile?: Express.Multer.File
  ): Promise<DetailPostWithUserIdRdo> {
    const newPost = await this.blogPostService.createPost(dto, imageFile, userId, requestId);

    return fillDto(DetailPostWithUserIdRdo, newPost.toPOJO());
  }

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
}
