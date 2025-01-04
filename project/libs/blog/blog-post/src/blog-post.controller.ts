import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';

import { PostIdApiParam, BlogPostApiResponse, blogPostApiBodyDescription } from './blog-post.constant';
import { BlogPostService } from './blog-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DetailPostRdo } from './rdo/detail-post.rdo';

@ApiTags('blog-post')
@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) { }

  /*
  @ApiResponse(BlogPostApiResponse.PostFound)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiParam(PostIdApiParam)
  */
  @Get('/')
  public async index(/*@Param(PostIdApiParam.name) postId: string*/) {
    //const existPost = await this.blogPostService.getPost(postId);

    //return fillDto(DetailPostRdo, existPost.toPOJO());
    return 'ok';
  }

  @ApiResponse(BlogPostApiResponse.PostFound)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiParam(PostIdApiParam)
  @Get(`:${PostIdApiParam.name}`)
  public async show(@Param(PostIdApiParam.name) postId: string) {
    //! нужно провалидировать корректроность postId на guid
    //! нужно проверить существование поста из параметров
    const existPost = await this.blogPostService.getPost(postId);

    return fillDto(DetailPostRdo, existPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostCreated)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  @ApiBody({ description: blogPostApiBodyDescription, type: CreatePostDto })
  @Post()
  public async create(@Body() dto: CreatePostDto) {
    //! нужно провалидировать корректроность postId на guid
    //! нужно проверить существование поста из параметров
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
  public async update(@Param(PostIdApiParam.name) postId: string, @Body() dto: UpdatePostDto) {
    //! нужно провалидировать корректроность postId на guid
    //! нужно проверить существование поста из параметров
    //! нужно проверить авторизацию
    //! нужно проверить, что пользователь это автор этого поста
    const userId = '11223344';
    const existPost = await this.blogPostService.updatePost(postId, dto, userId);

    return fillDto(DetailPostRdo, existPost.toPOJO());
  }

  @ApiResponse(BlogPostApiResponse.PostDeleted)
  @ApiResponse(BlogPostApiResponse.Unauthorized)
  @ApiResponse(BlogPostApiResponse.PostNotFound)
  @ApiResponse(BlogPostApiResponse.NotAllow)
  @ApiParam(PostIdApiParam)
  @Delete(`:${PostIdApiParam.name}`)
  public async delete(@Param(PostIdApiParam.name) postId: string) {
    //! нужно провалидировать корректроность postId на guid
    //! нужно проверить существование поста из параметров
    //! нужно проверить авторизацию
    //! нужно проверить, что пользователь это автор этого поста
    await this.blogPostService.deletePost(postId);
  }
}
