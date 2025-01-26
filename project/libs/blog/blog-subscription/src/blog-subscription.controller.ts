import { Controller, Delete, Get, HttpCode, Param, Post, Req } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { join } from 'path/posix';

import { fillDto } from '@project/shared/helpers';
import { MongoIdValidationPipe } from '@project/shared/pipes';
import { ApiHeaderOption, ApiParamOption, RequestWithUserId, RouteAlias, USER_ID_PARAM } from '@project/shared/core';

import { BlogSubscriptionService } from './blog-subscription.service';
import { UserSubscriptionsCountRdo } from './rdo/user-subscriptions-count.rdo';
import { BlogSubscriptionApiResponse } from './blog-subscription.constant';

@ApiTags('blog-subscription')
@ApiHeader(ApiHeaderOption.UserId) // глобально вроде не добавить? и примеры почемуто не работают...
@Controller(RouteAlias.Subscriptions)
export class BlogSubscriptionController {
  constructor(
    private readonly blogSubscriptionService: BlogSubscriptionService
  ) { }

  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionCreated)
  @ApiResponse(BlogSubscriptionApiResponse.Unauthorized)
  @ApiResponse(BlogSubscriptionApiResponse.BadRequest)
  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionExist)
  @ApiParam(ApiParamOption.UserId)
  @Post(USER_ID_PARAM)
  public async create(
    @Param(ApiParamOption.UserId.name, MongoIdValidationPipe) authorUserId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogSubscriptionService.subscribe(authorUserId, userId);
  }

  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionDeleted)
  @ApiResponse(BlogSubscriptionApiResponse.Unauthorized)
  @ApiResponse(BlogSubscriptionApiResponse.BadRequest)
  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionNotFound)
  @ApiParam(ApiParamOption.UserId)
  @HttpCode(BlogSubscriptionApiResponse.SubscriptionDeleted.status)
  @Delete(USER_ID_PARAM)
  public async delete(
    @Param(ApiParamOption.UserId.name, MongoIdValidationPipe) authorUserId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogSubscriptionService.unsubscribe(authorUserId, userId);
  }

  @ApiResponse(BlogSubscriptionApiResponse.UserSubscriptionsCount)
  @ApiResponse(BlogSubscriptionApiResponse.BadRequest)
  @ApiParam(ApiParamOption.UserId)
  @Get(join(RouteAlias.GetUserSubscriptionsCount, USER_ID_PARAM))
  public async getUserSubscriptionsCount(@Param(ApiParamOption.UserId.name, MongoIdValidationPipe) userId: string): Promise<UserSubscriptionsCountRdo> {
    const subscriptionsCount = await this.blogSubscriptionService.getUserSubscriptionsCount(userId);

    return fillDto(UserSubscriptionsCountRdo, { userId, subscriptionsCount });
  }
}
