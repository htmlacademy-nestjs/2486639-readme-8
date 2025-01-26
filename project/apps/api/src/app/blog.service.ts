import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { DetailPostWithUserIdRdo, DetailPostWithUserRdo, RouteAlias } from '@project/shared/core';
import { dtoToFormData, fillDto, makeHeaders, multerFileToFormData } from '@project/shared/helpers';
import { apiConfig } from '@project/api/config';
import { CreatePostDto, ImageOption, UpdatePostDto } from '@project/blog/blog-post';

import { UserService } from './user.service';

@Injectable()
export class BlogService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>,
    private userService: UserService
  ) { }

  public async createOrUpdate(
    postId: string,
    dto: CreatePostDto | UpdatePostDto,
    requestId: string,
    userId: string,
    imageFile?: Express.Multer.File
  ): Promise<DetailPostWithUserRdo> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}`;
    const formData = new FormData();
    const headers = makeHeaders(requestId, null, userId);

    dtoToFormData(dto, formData);

    if (imageFile) {
      multerFileToFormData(imageFile, formData, ImageOption.KEY);
    }

    const { data: post } =
      (!postId)
        ? await this.httpService.axiosRef.post<DetailPostWithUserIdRdo>(url, formData, headers)
        : await this.httpService.axiosRef.patch<DetailPostWithUserIdRdo>(`${url}/${postId}`, formData, headers);
    const user = await this.userService.getUser(post.userId, requestId);

    return fillDto(DetailPostWithUserRdo, { ...post, user });
  }
}
