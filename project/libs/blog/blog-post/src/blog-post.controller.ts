import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { /*ApiParam, ApiResponse,*/ ApiTags } from '@nestjs/swagger';

import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { POST_ID_NAME } from './blog-post.constant';

@ApiTags('blog')
@Controller('post')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  //@ApiResponse(AuthenticationApiResponse.UserCreated)
  //@ApiResponse(AuthenticationApiResponse.UserExist)
  @Post()
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.create(dto);

    return newPost.toPOJO();
  }

  //@ApiResponse(AuthenticationApiResponse.UserFound)
  //@ApiResponse(AuthenticationApiResponse.UserNotFound)
  //@ApiParam(AuthenticationApiParam.UserId)
  @Get(`:${POST_ID_NAME}`)
  public async show(@Param(POST_ID_NAME) postId: string) {
    console.log(postId);
    const existPost = await this.blogPostService.getPost(postId);

    return existPost.toPOJO();
  }
}
