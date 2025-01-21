import {
  Body, Controller, Delete, Get, HttpCode, Param, Patch,
  Post, Query, Req, UploadedFile, UseInterceptors
} from '@nestjs/common';
import { ApiConsumes, ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { fillDto } from '@project/shared/helpers';
import { BlogRequestIdApiHeader, BlogUserIdApiHeader, RequestWithRequestIdAndUserId, RequestWithUserId, RouteAlias } from '@project/shared/core';
import { GuidValidationPipe, MongoIdValidationPipe } from '@project/shared/pipes';
import { UserIdApiParam } from '@project/account/authentication';

import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRdo } from './rdo/post.rdo';
import { DetailPostRdo } from './rdo/detail-post.rdo';
import { PostWithPaginationRdo } from './rdo/post-with-pagination.rdo';
import { UserPostsCountRdo } from './rdo/user-posts-count.rdo';
import { PageQuery } from './query/page.query';
import { TitleQuery } from './query/title.query';
import { BaseBlogPostQuery } from './query/base-blog-post.query';
import { SearchBlogPostQuery } from './query/search-blog-post.query';
import { PostIdApiParam, BlogPostApiResponse, ImageOption, parseFilePipeBuilder, POST_ID_PARAM } from './blog-post.constant';

@ApiTags('blog-post')
@ApiHeader(BlogUserIdApiHeader) // глобально вроде не добавить? и примеры почемуто не работают...
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
  ): Promise<PostWithPaginationRdo> {
    const postsWithPagination = await this.blogPostService.getAllPosts(query, currentUserId, checkAuthorization, showDraft);
    const result = {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map((post) => post.toPOJO())
    }

    return fillDto(PostWithPaginationRdo, result);
  }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get('/')
  public async index(@Query() query: SearchBlogPostQuery): Promise<PostWithPaginationRdo> {
    const posts = await this.getPostsWithPagination(query);

    return posts;
  }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get(`/${RouteAlias.Search}`)
  public async find(@Query() { title }: TitleQuery): Promise<PostRdo[]> {
    const postEntities = await this.blogPostService.findPostsByTitle(title);

    return postEntities.map((postEntity) => fillDto(PostRdo, postEntity.toPOJO()));
  }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @Get(`/${RouteAlias.MyPosts}`)
  public async getMyPosts(
    @Query() { page }: PageQuery,
    @Req() { userId }: RequestWithUserId
  ): Promise<PostWithPaginationRdo> {
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
  ): Promise<PostWithPaginationRdo> {
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
  ): Promise<PostWithPaginationRdo> {
    const postsWithPagination = await this.blogPostService.getFeed(query, userId);
    const result = {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map((post) => post.toPOJO())
    }

    return fillDto(PostWithPaginationRdo, result);
  }

  @ApiResponse(BlogPostApiResponse.PostFound)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiParam(PostIdApiParam)
  @Get(POST_ID_PARAM)
  public async show(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<DetailPostRdo> {
    const existPost = await this.blogPostService.getPost(postId, userId);

    return fillDto(DetailPostRdo, existPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostCreated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @ApiConsumes('multipart/form-data')
  @ApiHeader(BlogRequestIdApiHeader)
  @UseInterceptors(FileInterceptor(ImageOption.KEY))
  @Post()
  public async create(
    @Body() dto: CreatePostDto,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId,
    @UploadedFile(parseFilePipeBuilder) imageFile?: Express.Multer.File
  ): Promise<DetailPostRdo> {
    const newPost = await this.blogPostService.createPost(dto, imageFile, userId, requestId);

    return fillDto(DetailPostRdo, newPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostUpdated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @ApiConsumes('multipart/form-data')
  @ApiHeader(BlogRequestIdApiHeader)
  @UseInterceptors(FileInterceptor(ImageOption.KEY))
  @Patch(POST_ID_PARAM)
  public async update(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Body() dto: UpdatePostDto,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId,
    @UploadedFile(parseFilePipeBuilder) imageFile?: Express.Multer.File
  ): Promise<DetailPostRdo> {
    const updatedPost = await this.blogPostService.updatePost(postId, dto, imageFile, userId, requestId);

    return fillDto(DetailPostRdo, updatedPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostReposted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.AlreadyReposted)
  @ApiParam(PostIdApiParam)
  @Post(`/${RouteAlias.Repost}/${POST_ID_PARAM}`)
  public async repost(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<DetailPostRdo> {
    const repostedPost = await this.blogPostService.repostPost(postId, userId);

    return fillDto(DetailPostRdo, repostedPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostDeleted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @HttpCode(BlogPostApiResponse.PostDeleted.status)
  @Delete(POST_ID_PARAM)
  public async delete(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogPostService.deletePost(postId, userId);
  }

  @ApiResponse(BlogPostApiResponse.UserPostsCount)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @ApiParam(UserIdApiParam)
  @Get(`/${RouteAlias.GetUserPostsCount}/:${UserIdApiParam.name}`)
  public async getUserPostsCount(@Param(UserIdApiParam.name, MongoIdValidationPipe) userId: string): Promise<UserPostsCountRdo> {
    const postsCount = await this.blogPostService.getUserPostsCount(userId);

    return fillDto(UserPostsCountRdo, { userId, postsCount });
  }
}
