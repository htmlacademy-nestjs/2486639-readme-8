import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BlogPostApiParam, BlogPostApiResponse, POST_ID_NAME } from './blog-post.constant';
import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('blog-post')
@Controller('post')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  @ApiResponse(BlogPostApiResponse.PostCreated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @Post()
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.create(dto);

    return newPost.toPOJO();
  }

  @ApiResponse(BlogPostApiResponse.PostFound)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiParam(BlogPostApiParam.PostId)
  @Get(`:${POST_ID_NAME}`)
  public async show(@Param(POST_ID_NAME) postId: string) {
    console.log(postId);
    const existPost = await this.blogPostService.getById(postId);

    return existPost.toPOJO();
  }

  @ApiResponse(BlogPostApiResponse.PostUpdated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(BlogPostApiParam.PostId)
  @Put(`:${POST_ID_NAME}`)
  public async update(@Param(POST_ID_NAME) postId: string, @Body() dto: UpdatePostDto) {
    const existPost = await this.blogPostService.updateById(postId, dto);

    return existPost.toPOJO();
  }

  @ApiResponse(BlogPostApiResponse.PostDeleted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(BlogPostApiParam.PostId)
  @Delete(`:${POST_ID_NAME}`)
  public async delete(@Param(POST_ID_NAME) postId: string) {
    await this.blogPostService.deleteById(postId);
  }
}
