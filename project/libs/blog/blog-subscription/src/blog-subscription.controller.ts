import { Controller, Delete, Get, HttpCode, Param, Post, Req } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';
import { MongoIdValidationPipe } from '@project/shared/pipes';
import { RequestWithUserId, RouteAlias } from '@project/shared/core';
import { UserIdApiParam } from '@project/account/authentication';
import { BlogUserIdApiHeader } from '@project/blog/blog-post';

import { BlogSubscriptionService } from './blog-subscription.service';
import { UserSubscriptionsCountRdo } from './rdo/user-subscriptions-count.rdo';
import { AUTHOR_USER_ID_PARAM, authorUserIdApiParam/*, BlogPostLikeApiResponse*/ } from './blog-subscription.constant';

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

  /*
  @ApiResponse(BlogPostApiResponse.UserInfo)
  @ApiResponse(BlogPostApiResponse.BadRequest)
  */
  @ApiParam(UserIdApiParam)
  @Get(`/${RouteAlias.GetUserSubscriptionsCount}/:${UserIdApiParam.name}`)
  public async getUserPostsCount(@Param(UserIdApiParam.name, MongoIdValidationPipe) userId: string): Promise<UserSubscriptionsCountRdo> {
    const subscriptionsCount = await this.blogSubscriptionService.getAuthorSubscriptionsCount(userId);

    return fillDto(UserSubscriptionsCountRdo, { userId, subscriptionsCount });
  }
}
