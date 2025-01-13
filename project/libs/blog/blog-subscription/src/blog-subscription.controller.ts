import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MongoIdValidationPipe } from '@project/shared/pipes';

import { AUTHOR_USER_ID_PARAM, authorUserIdApiParam/*, BlogPostLikeApiResponse*/ } from './blog-subscription.constant';
import { BlogSubscriptionService } from './blog-subscription.service';

@ApiTags('blog-subscription')
@Controller('subscriptions')
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
  public async create(@Param(authorUserIdApiParam.name, MongoIdValidationPipe) authorUserId: string) {
    // необходимо определить пользователя
    const currentUserId = '11223344';
    await this.blogSubscriptionService.subscribe(authorUserId, currentUserId);
  }

  /*
  @ApiResponse(BlogPostLikeApiResponse.PostLikeDeleted)
  @ApiResponse(BlogPostLikeApiResponse.Unauthorized)
  @ApiResponse(BlogPostLikeApiResponse.BadRequest)
  @ApiResponse(BlogPostLikeApiResponse.PostNotFound)
  @ApiResponse(BlogPostLikeApiResponse.LikeNotFound)
  */
  @ApiParam(authorUserIdApiParam)
  @Delete(AUTHOR_USER_ID_PARAM)
  public async delete(@Param(authorUserIdApiParam.name, MongoIdValidationPipe) authorUserId: string) {
    // необходимо определить пользователя
    const currentUserId = '11223344'
    await this.blogSubscriptionService.unsubscribe(authorUserId, currentUserId);
  }
}
