import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import {
  DetailUserRdo, PostWithUserAndPaginationRdo, PostWithUserIdAndPaginationRdo,
  PostWithUserIdRdo, PostWithUserRdo, RouteAlias, UserRdo
} from '@project/shared/core';
import { fillDto, makeHeaders } from '@project/shared/helpers';
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
    const user = await this.getUser(id, requestId);
    const headers = makeHeaders(requestId);
    const getPostsCountUrl = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}/${RouteAlias.GetUserPostsCount}/${id}`;
    const { data: { postsCount } } = await this.httpService.axiosRef.get<UserPostsCountRdo>(getPostsCountUrl, headers);
    const getSubscriptionsCountUrl = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Subscriptions}/${RouteAlias.GetUserSubscriptionsCount}/${id}`;
    const { data: { subscriptionsCount } } = await this.httpService.axiosRef.get<UserSubscriptionsCountRdo>(getSubscriptionsCountUrl, headers);

    return {
      ...user,
      postsCount,
      subscriptionsCount
    };
  }

  public async replaceUserIdOnUser(posts: PostWithUserIdRdo[], requestId: string): Promise<PostWithUserRdo[]> {
    if (!posts.length) {
      return [];
    }

    const items: PostWithUserRdo[] = [];
    const users = new Map<string, UserRdo>();

    for (const post of posts) {
      const { userId } = post;

      if (!users.has(userId)) {
        users.set(userId, await this.getUser(userId, requestId));
      }

      items.push(fillDto(PostWithUserRdo, { ...post, user: users.get(userId) }));
    }

    return items;
  }

  public async fillUser(data: PostWithUserIdAndPaginationRdo, requestId: string): Promise<PostWithUserAndPaginationRdo> {
    const { entities, currentPage, itemsPerPage, totalItems, totalPages } = data;
    const posts = await this.replaceUserIdOnUser(entities, requestId);

    return { entities: posts, currentPage, itemsPerPage, totalItems, totalPages };
  }
}
