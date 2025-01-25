import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { DetailUserRdo, RouteAlias, UserRdo } from '@project/shared/core';
import { makeHeaders } from '@project/shared/helpers';
import { apiConfig } from '@project/api/config';
import { UserPostsCountRdo } from '@project/blog/blog-post';
import { UserSubscriptionsCountRdo } from '@project/blog/blog-subscription';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  public async getUser(id: string, requestId: string): Promise<UserRdo> {
    const url = `${this.apiOptions.accountServiceUrl}/${id}`;
    const { data } = await this.httpService.axiosRef.get<UserRdo>(url, makeHeaders(requestId));

    return data;
  }

  public async getDetailUser(id: string, requestId: string): Promise<DetailUserRdo> {
    const { id: userId, registrationDate } = await this.getUser(id, requestId);
    const headers = makeHeaders(requestId);
    const getPostsCountUrl = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}/${RouteAlias.GetUserPostsCount}/${userId}`;
    const { data: { postsCount } } = await this.httpService.axiosRef.get<UserPostsCountRdo>(getPostsCountUrl, headers);
    const getSubscriptionsCountUrl = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Subscriptions}/${RouteAlias.GetUserSubscriptionsCount}/${userId}`;
    const { data: { subscriptionsCount } } = await this.httpService.axiosRef.get<UserSubscriptionsCountRdo>(getSubscriptionsCountUrl, headers);

    return {
      id,
      registrationDate,
      postsCount,
      subscriptionsCount
    };
  }
}
