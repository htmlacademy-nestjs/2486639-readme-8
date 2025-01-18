import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseInterceptors } from '@nestjs/common';
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
@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get('/')
  public async index(@Query() query: BlogPostQuery): Promise<PostWithPaginationRdo> {
    //! определить пользователя
    const currentUserId = '11223344';
    const postsWithPagination = await this.blogPostService.getAllPosts(query, currentUserId);
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
  public async show(@Param(PostIdApiParam.name, GuidValidationPipe) postId: string): Promise<DetailPostRdo> {
    //! определить пользователя
    const currentUserId = '11223344';
    const existPost = await this.blogPostService.getPost(postId, currentUserId);

    return fillDto(DetailPostRdo, existPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostCreated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @ApiHeaders([BlogRequestIdApiHeader, BlogUserIdRequiredApiHeader]) //! попроббовать у контроллера, глобально вроде не добавить? и примеры почемуто не работают...
  @ApiBody({ description: blogPostApiBodyDescription, type: CreatePostDto, examples: { video: {} } }) //! а type нужен? и попробовать добавить examples с готовыми примерами, т.к. по умолчанию пример собран по дто
  @Post()
  public async create(@Body() dto: CreatePostDto, @Req() { userId }: RequestWithUserId): Promise<DetailPostRdo> {
    const newPost = await this.blogPostService.createPost(dto, userId);

    return fillDto(DetailPostRdo, newPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostUpdated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @Patch(`:${PostIdApiParam.name}`)
  public async update(@Param(PostIdApiParam.name, GuidValidationPipe) postId: string, @Body() dto: UpdatePostDto): Promise<DetailPostRdo> {
    //! определить пользователя
    const currentUserId = '11223344';
    const updatedPost = await this.blogPostService.updatePost(postId, dto, currentUserId);

    return fillDto(DetailPostRdo, updatedPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostDeleted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @Delete(`:${PostIdApiParam.name}`)
  public async delete(@Param(PostIdApiParam.name, GuidValidationPipe) postId: string): Promise<void> {
    //! определить пользователя
    const currentUserId = '11223344';

    await this.blogPostService.deletePost(postId, currentUserId);
  }
}
