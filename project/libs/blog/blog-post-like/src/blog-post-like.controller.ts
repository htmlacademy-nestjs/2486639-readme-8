import { Controller, Delete, HttpCode, Param, Post, Req } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GuidValidationPipe } from '@project/shared/pipes';
import { RequestWithUserId, RouteAlias } from '@project/shared/core';
import { BlogUserIdApiHeader } from '@project/blog/blog-post';

import { POST_ID_PARAM, PostIdApiParam, BlogPostLikeApiResponse } from './blog-post-like.constant';
import { BlogPostLikeService } from './blog-post-like.service';

@ApiTags('blog-post-like')
@ApiHeader(BlogUserIdApiHeader)
@Controller(RouteAlias.PostLikes)
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
  public async create(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogPostLikeService.like(postId, userId);
  }

  @ApiResponse(BlogPostLikeApiResponse.PostLikeDeleted)
  @ApiResponse(BlogPostLikeApiResponse.Unauthorized)
  @ApiResponse(BlogPostLikeApiResponse.BadRequest)
  @ApiResponse(BlogPostLikeApiResponse.PostNotFound)
  @ApiResponse(BlogPostLikeApiResponse.LikeNotFound)
  @ApiParam(PostIdApiParam)
  @HttpCode(BlogPostLikeApiResponse.PostLikeDeleted.status)
  @Delete(POST_ID_PARAM)
  public async delete(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogPostLikeService.unlike(postId, userId);
  }
}
