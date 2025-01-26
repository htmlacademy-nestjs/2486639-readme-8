import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Query, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  ApiParamOption, BearerAuth, COMMENT_ID_PARAM, CommentWithUserAndPaginationRdo, RouteAlias,
  CommentWithUserRdo, PageQuery, POST_ID_PARAM, RequestWithRequestId, UserRdo,
  CommentWithUserIdRdo, CommentWithUserIdAndPaginationRdo, RequestWithRequestIdAndUserId
} from '@project/shared/core';
import { fillDto, getQueryString, makeHeaders } from '@project/shared/helpers';
import { GuidValidationPipe } from '@project/shared/pipes';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';
import { apiConfig } from '@project/api/config';
import { BlogPostCommentApiResponse, CreatePostCommentDto } from '@project/blog/blog-post-comment';

import { CheckAuthGuard } from './guards/check-auth.guard';
import { UserService } from './user.service';

@ApiTags('blog')
@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>,
    private readonly userService: UserService
  ) { }

  // Комметарии
  @ApiResponse({ ...BlogPostCommentApiResponse.PostCommentsFound, type: CommentWithUserAndPaginationRdo })
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiParam(ApiParamOption.PostId)
  @Get(`${RouteAlias.PostComments}/${POST_ID_PARAM}`)
  public async index(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Query() pageQuery: PageQuery,
    @Req() { requestId }: RequestWithRequestId
  ): Promise<CommentWithUserAndPaginationRdo> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.PostComments}/${postId}${getQueryString(pageQuery)}`;
    const { data } = await this.httpService.axiosRef.get<CommentWithUserIdAndPaginationRdo>(url, makeHeaders(requestId));
    const { entities, currentPage, itemsPerPage, totalItems, totalPages } = data;
    const comments: CommentWithUserRdo[] = [];
    const users = new Map<string, UserRdo>();

    for (const entity of entities) {
      const { userId } = entity;

      if (!users.has(userId)) {
        users.set(userId, await this.userService.getUser(userId, requestId));
      }

      comments.push(fillDto(CommentWithUserRdo, { ...entity, user: users.get(userId) }));
    }

    return fillDto(CommentWithUserAndPaginationRdo, { entities: comments, currentPage, itemsPerPage, totalItems, totalPages });
  }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentCreated)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiResponse(BlogPostCommentApiResponse.CommentOnPostExist)
  @ApiParam(ApiParamOption.PostId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Post(`${RouteAlias.PostComments}/${POST_ID_PARAM}`)
  public async create(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Body() dto: CreatePostCommentDto,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<CommentWithUserRdo> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.PostComments}/${postId}`;
    const { data: comment } = await this.httpService.axiosRef.post<CommentWithUserIdRdo>(url, dto, makeHeaders(requestId, null, userId));
    const user = this.userService.getUser(comment.userId, requestId);

    return fillDto(CommentWithUserRdo, { ...comment, user });
  }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentDeleted)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiResponse(BlogPostCommentApiResponse.CommentNotFound)
  @ApiParam(ApiParamOption.CommentId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @HttpCode(BlogPostCommentApiResponse.PostCommentDeleted.status)
  @Delete(`${RouteAlias.PostComments}/${COMMENT_ID_PARAM}`)
  public async delete(
    @Param(ApiParamOption.CommentId.name, GuidValidationPipe) commentId: string,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<void> {
    const url = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.PostComments}/${commentId}`;

    await this.httpService.axiosRef.delete(url, makeHeaders(requestId, null, userId));
  }

  // Лайки

  // Подписки
}
