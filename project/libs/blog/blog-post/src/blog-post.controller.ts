import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';

import { PostIdApiParam, BlogPostApiResponse } from './blog-post.constant';
import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRdo } from './rdo/post.rdo';
import { DetailPostRdo } from './rdo/detail-post.rdo';

@ApiTags('blog-post')
@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  @ApiResponse(BlogPostApiResponse.PostCreated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @Post()
  public async create(@Body() dto: CreatePostDto) {
    const userId = '11223344';
    const newPost = await this.blogPostService.createPost(dto, userId);

    return fillDto(PostRdo, newPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostFound)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiParam(PostIdApiParam)
  @Get(`:${PostIdApiParam.name}`)
  public async show(@Param(PostIdApiParam.name) postId: string) {
    const existPost = await this.blogPostService.getPost(postId);

    return fillDto(DetailPostRdo, existPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostUpdated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @Patch(`:${PostIdApiParam.name}`)
  public async update(@Param(PostIdApiParam.name) postId: string, @Body() dto: UpdatePostDto) {
    const userId = '11223344';
    const existPost = await this.blogPostService.updatePost(postId, dto, userId);

    return fillDto(PostRdo, existPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostDeleted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @Delete(`:${PostIdApiParam.name}`)
  public async delete(@Param(PostIdApiParam.name) postId: string) {
    await this.blogPostService.deletePost(postId);
  }
}
