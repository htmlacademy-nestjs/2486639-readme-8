import { Controller, Delete, Get, HttpCode, Param, Post, Req } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';
import { MongoIdValidationPipe } from '@project/shared/pipes';
import { BlogUserIdApiHeader, RequestWithUserId, RouteAlias } from '@project/shared/core';
import { UserIdApiParam } from '@project/account/authentication';

import { BlogSubscriptionService } from './blog-subscription.service';
import { UserSubscriptionsCountRdo } from './rdo/user-subscriptions-count.rdo';
import { USER_ID_PARAM, userIdApiParam, BlogSubscriptionApiResponse } from './blog-subscription.constant';

@ApiTags('blog-subscription')
@ApiHeader(BlogUserIdApiHeader) // глобально вроде не добавить? и примеры почемуто не работают...
@Controller(RouteAlias.Subscriptions)
export class BlogSubscriptionController {
  constructor(
    private readonly blogSubscriptionService: BlogSubscriptionService
  ) { }

  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionCreated)
  @ApiResponse(BlogSubscriptionApiResponse.Unauthorized)
  @ApiResponse(BlogSubscriptionApiResponse.BadRequest)
  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionExist)
  @ApiParam(userIdApiParam)
  @Post(USER_ID_PARAM)
  public async create(
    @Param(userIdApiParam.name, MongoIdValidationPipe) authorUserId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogSubscriptionService.subscribe(authorUserId, userId);
  }

  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionDeleted)
  @ApiResponse(BlogSubscriptionApiResponse.Unauthorized)
  @ApiResponse(BlogSubscriptionApiResponse.BadRequest)
  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionNotFound)
  @ApiParam(userIdApiParam)
  @HttpCode(BlogSubscriptionApiResponse.SubscriptionDeleted.status)
  @Delete(USER_ID_PARAM)
  public async delete(
    @Param(userIdApiParam.name, MongoIdValidationPipe) authorUserId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogSubscriptionService.unsubscribe(authorUserId, userId);
  }

  @ApiResponse(BlogSubscriptionApiResponse.UserSubscriptionsCount)
  @ApiResponse(BlogSubscriptionApiResponse.BadRequest)
  @ApiParam(UserIdApiParam)
  @Get(`/${RouteAlias.GetUserSubscriptionsCount}/:${UserIdApiParam.name}`)
  public async getUserSubscriptionsCount(@Param(UserIdApiParam.name, MongoIdValidationPipe) userId: string): Promise<UserSubscriptionsCountRdo> {
    const subscriptionsCount = await this.blogSubscriptionService.getUserSubscriptionsCount(userId);

    return fillDto(UserSubscriptionsCountRdo, { userId, subscriptionsCount });
  }
}
