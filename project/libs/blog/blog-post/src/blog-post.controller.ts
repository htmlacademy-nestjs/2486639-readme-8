import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';
import { GuidValidationPipe } from '@project/shared/pipes';

import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DetailPostRdo } from './rdo/detail-post.rdo';
import { PostWithPaginationRdo } from './rdo/post-with-pagination.rdo';
import { BlogPostQuery } from './blog-post.query';
import { PostIdApiParam, BlogPostApiResponse, blogPostApiBodyDescription } from './blog-post.constant';

@ApiTags('blog-post')
@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  @ApiResponse(BlogPostApiResponse.PostsFound)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Get('/')
  public async index(@Query() query: BlogPostQuery) {
    query.showDraft = ((query.showDraft) && (query.userId) && (query.userId === '11223344'));//! пользователя можно определить, если требуются черновики

    const postsWithPagination = await this.blogPostService.getAllPosts(query);
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
  public async show(@Param(PostIdApiParam.name, GuidValidationPipe) postId: string) {
    const existPost = await this.blogPostService.getPost(postId);

    return fillDto(DetailPostRdo, existPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostCreated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @ApiBody({ description: blogPostApiBodyDescription, type: CreatePostDto })
  @Post()
  public async create(@Body() dto: CreatePostDto) {
    //! нужно проверить авторизацию
    const userId = '11223344';
    const newPost = await this.blogPostService.createPost(dto, userId);

    return fillDto(DetailPostRdo, newPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostUpdated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @Patch(`:${PostIdApiParam.name}`)
  public async update(@Param(PostIdApiParam.name, GuidValidationPipe) postId: string, @Body() dto: UpdatePostDto) {
    //! нужно проверить авторизацию
    const userId = '11223344';
    const updatedPost = await this.blogPostService.updatePost(postId, dto, userId);

    return fillDto(DetailPostRdo, updatedPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostDeleted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @Delete(`:${PostIdApiParam.name}`)
  public async delete(@Param(PostIdApiParam.name, GuidValidationPipe) postId: string) {
    //! нужно проверить авторизацию
    const userId = '11223344';

    await this.blogPostService.deletePost(postId, userId);
  }
}
