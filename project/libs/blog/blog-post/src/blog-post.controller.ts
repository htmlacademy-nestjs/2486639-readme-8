import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';
import { RequestWithUserId } from '@project/shared/core';
import { GuidValidationPipe } from '@project/shared/pipes';

import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DetailPostRdo } from './rdo/detail-post.rdo';
import { PostWithPaginationRdo } from './rdo/post-with-pagination.rdo';
import { BlogPostQuery } from './blog-post.query';
import { PostIdApiParam, BlogPostApiResponse, blogPostApiBodyDescription } from './blog-post.constant';
import { BlogRequestIdApiHeader, BlogUserIdRequiredApiHeader } from './blog-post.constant.header';

@ApiTags('blog-post')
@ApiHeaders([BlogRequestIdApiHeader, BlogUserIdRequiredApiHeader]) // глобально вроде не добавить? и примеры почемуто не работают...
@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get('/')
  public async index(
    @Query() query: BlogPostQuery,
    @Req() { userId }: RequestWithUserId
  ): Promise<PostWithPaginationRdo> {
    const postsWithPagination = await this.blogPostService.getAllPosts(query, userId);
    const result = {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map((post) => post.toPOJO())
    }

    return fillDto(PostWithPaginationRdo, result);
  }

  @ApiResponse(BlogPostApiResponse.PostFound)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiParam(PostIdApiParam)
  @Get(`:${PostIdApiParam.name}`)
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
  @ApiBody({
    description: blogPostApiBodyDescription,
    type: CreatePostDto, //! а type нужен?
    examples: { video: {} } //! попробовать добавить examples с готовыми примерами, т.к. по умолчанию пример собран по дто
  })
  @Post()
  public async create(
    @Body() dto: CreatePostDto,
    @Req() { userId }: RequestWithUserId
  ): Promise<DetailPostRdo> {
    const newPost = await this.blogPostService.createPost(dto, userId);

    return fillDto(DetailPostRdo, newPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostUpdated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @Patch(`:${PostIdApiParam.name}`)
  public async update(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Body() dto: UpdatePostDto,
    @Req() { userId }: RequestWithUserId
  ): Promise<DetailPostRdo> {
    const updatedPost = await this.blogPostService.updatePost(postId, dto, userId);

    return fillDto(DetailPostRdo, updatedPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostDeleted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @Delete(`:${PostIdApiParam.name}`)
  public async delete(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogPostService.deletePost(postId, userId);
  }
}
