import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GuidValidationPipe } from '@project/shared/pipes';

import { POST_ID_PARAM, PostIdApiParam, BlogPostLikeApiResponse } from './blog-post-like.constant';
import { BlogPostLikeService } from './blog-post-like.service';

@ApiTags('blog-post-like')
@Controller('post-likes')
export class BlogPostLikeController {
  constructor(
    private readonly blogPostLikeService: BlogPostLikeService
  ) { }

  @ApiResponse(BlogPostLikeApiResponse.PostLikeCreated)
  @ApiResponse(BlogPostLikeApiResponse.Unauthorized)
  @ApiResponse(BlogPostLikeApiResponse.BadRequest)
  @ApiResponse(BlogPostLikeApiResponse.PostNotFound)
  @ApiResponse(BlogPostLikeApiResponse.LikeOnPostExist)
  @ApiParam(PostIdApiParam)
  @Post(POST_ID_PARAM)
  public async create(@Param(PostIdApiParam.name, GuidValidationPipe) postId: string) {
    // необходимо определить пользователя
    const currentUserId = '11223344';
    await this.blogPostLikeService.like(postId, currentUserId);
  }

  @ApiResponse(BlogPostLikeApiResponse.PostLikeDeleted)
  @ApiResponse(BlogPostLikeApiResponse.Unauthorized)
  @ApiResponse(BlogPostLikeApiResponse.BadRequest)
  @ApiResponse(BlogPostLikeApiResponse.PostNotFound)
  @ApiResponse(BlogPostLikeApiResponse.LikeNotFound)
  @ApiParam(PostIdApiParam)
  @Delete(POST_ID_PARAM)
  public async delete(@Param(PostIdApiParam.name, GuidValidationPipe) postId: string) {
    // необходимо определить пользователя
    const currentUserId = '11223344'

    await this.blogPostLikeService.unlike(postId, currentUserId);
  }
}
