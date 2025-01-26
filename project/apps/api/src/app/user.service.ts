import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { join } from 'path/posix';

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

  public getUrl(route = ''): string {
    return join(this.apiOptions.accountServiceUrl, route);
  }

  public async getUser(id: string, requestId: string): Promise<UserRdo> {
    const url = this.getUrl(id);
    const headers = makeHeaders(requestId);
    const { data } = await this.httpService.axiosRef.get<UserRdo>(url, headers);

    return data;
  }

  public async getDetailUser(id: string, requestId: string): Promise<DetailUserRdo> {
    const user = await this.getUser(id, requestId);
    const headers = makeHeaders(requestId);
    const getPostsCountUrl = join(this.apiOptions.blogPostServiceUrl, RouteAlias.Posts, RouteAlias.GetUserPostsCount, id);
    const { data: { postsCount } } = await this.httpService.axiosRef.get<UserPostsCountRdo>(getPostsCountUrl, headers);
    const getSubscriptionsCountUrl = join(this.apiOptions.blogPostServiceUrl, RouteAlias.Subscriptions, RouteAlias.GetUserSubscriptionsCount, id);
    const { data: { subscriptionsCount } } = await this.httpService.axiosRef.get<UserSubscriptionsCountRdo>(getSubscriptionsCountUrl, headers);

    return {
      ...user,
      postsCount,
      subscriptionsCount
    };
  }
}
