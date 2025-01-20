import { Controller, Delete, HttpCode, Param, Post, Req } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';

import { MongoIdValidationPipe } from '@project/shared/pipes';
import { RequestWithUserId, RouteAlias } from '@project/shared/core';
import { BlogUserIdApiHeader } from '@project/blog/blog-post';

import { AUTHOR_USER_ID_PARAM, authorUserIdApiParam/*, BlogPostLikeApiResponse*/ } from './blog-subscription.constant';
import { BlogSubscriptionService } from './blog-subscription.service';

@ApiTags('blog-subscription')
@ApiHeader(BlogUserIdApiHeader) // глобально вроде не добавить? и примеры почемуто не работают...
@Controller(RouteAlias.Subscriptions)
export class BlogSubscriptionController {
  constructor(
    private readonly blogSubscriptionService: BlogSubscriptionService
  ) { }

  /*
  @ApiResponse(BlogPostLikeApiResponse.PostLikeCreated)
  @ApiResponse(BlogPostLikeApiResponse.Unauthorized)
  @ApiResponse(BlogPostLikeApiResponse.BadRequest)
  @ApiResponse(BlogPostLikeApiResponse.PostNotFound)
  @ApiResponse(BlogPostLikeApiResponse.LikeOnPostExist)
  */
  @ApiParam(authorUserIdApiParam)
  @Post(AUTHOR_USER_ID_PARAM)
  public async create(
    @Param(authorUserIdApiParam.name, MongoIdValidationPipe) authorUserId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogSubscriptionService.subscribe(authorUserId, userId);
  }

  /*
  @ApiResponse(BlogPostLikeApiResponse.PostLikeDeleted)
  @ApiResponse(BlogPostLikeApiResponse.Unauthorized)
  @ApiResponse(BlogPostLikeApiResponse.BadRequest)
  @ApiResponse(BlogPostLikeApiResponse.PostNotFound)
  @ApiResponse(BlogPostLikeApiResponse.LikeNotFound)
  */
  @ApiParam(authorUserIdApiParam)
  //@HttpCode(BlogPostLikeApiResponse.PostLikeDeleted.status)
  @Delete(AUTHOR_USER_ID_PARAM)
  public async delete(
    @Param(authorUserIdApiParam.name, MongoIdValidationPipe) authorUserId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogSubscriptionService.unsubscribe(authorUserId, userId);
  }
}
