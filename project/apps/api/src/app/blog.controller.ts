import {
  Body, Controller, Delete, Get, HttpCode, Param,
  Post, Query, Req, UseFilters, UseGuards
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { join } from 'path/posix';

import {
  ApiParamOption, BearerAuth, COMMENT_ID_PARAM, CommentWithUserAndPaginationRdo, RouteAlias,
  CommentWithUserRdo, PageQuery, POST_ID_PARAM, RequestWithRequestId, USER_ID_PARAM, UserRdo,
  CommentWithUserIdRdo, CommentWithUserIdAndPaginationRdo, RequestWithRequestIdAndUserId, ApiOperationOption
} from '@project/shared/core';
import { fillDto, makeHeaders } from '@project/shared/helpers';
import { GuidValidationPipe, MongoIdValidationPipe } from '@project/shared/pipes';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';
import { BlogPostCommentApiResponse, CreatePostCommentDto } from '@project/blog/blog-post-comment';
import { BlogPostLikeApiResponse } from '@project/blog/blog-post-like';
import { BlogSubscriptionApiResponse } from '@project/blog/blog-subscription';

import { CheckAuthGuard } from './guards/check-auth.guard';
import { BlogService } from './blog.service';
import { UserService } from './user.service';

@ApiTags('blog')
@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
    private readonly blogService: BlogService,
    private readonly userService: UserService
  ) { }

  // Комметарии
  @ApiOperation(ApiOperationOption.Comment.Index)
  @ApiResponse({ ...BlogPostCommentApiResponse.PostCommentsFound, type: CommentWithUserAndPaginationRdo })
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiParam(ApiParamOption.PostId)
  @Get(join('comments', POST_ID_PARAM))
  public async getComments(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Query() pageQuery: PageQuery,
    @Req() { requestId }: RequestWithRequestId
  ): Promise<CommentWithUserAndPaginationRdo> {
    const url = this.blogService.getCommentsUrl(postId, pageQuery);
    const headers = makeHeaders(requestId);
    const { data } = await this.httpService.axiosRef.get<CommentWithUserIdAndPaginationRdo>(url, headers);
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

  @ApiOperation(ApiOperationOption.Comment.Add)
  @ApiResponse(BlogPostCommentApiResponse.PostCommentCreated)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiResponse(BlogPostCommentApiResponse.CommentOnPostExist)
  @ApiParam(ApiParamOption.PostId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Post(join('comments', POST_ID_PARAM))
  public async createComment(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Body() dto: CreatePostCommentDto,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<CommentWithUserRdo> {
    const url = this.blogService.getCommentsUrl(postId);
    const headers = makeHeaders(requestId, null, userId);
    const { data: comment } = await this.httpService.axiosRef.post<CommentWithUserIdRdo>(url, dto, headers);
    const user = this.userService.getUser(comment.userId, requestId);

    return fillDto(CommentWithUserRdo, { ...comment, user });
  }

  @ApiOperation(ApiOperationOption.Comment.Delete)
  @ApiResponse(BlogPostCommentApiResponse.PostCommentDeleted)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.CommentNotFound)
  @ApiParam(ApiParamOption.CommentId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @HttpCode(BlogPostCommentApiResponse.PostCommentDeleted.status)
  @Delete(join('comments', COMMENT_ID_PARAM))
  public async deleteComment(
    @Param(ApiParamOption.CommentId.name, GuidValidationPipe) commentId: string,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<void> {
    const url = this.blogService.getCommentsUrl(commentId);
    const headers = makeHeaders(requestId, null, userId);

    await this.httpService.axiosRef.delete(url, headers);
  }

  // Лайки
  @ApiOperation(ApiOperationOption.Like.Add)
  @ApiResponse(BlogPostLikeApiResponse.PostLikeCreated)
  @ApiResponse(BlogPostLikeApiResponse.Unauthorized)
  @ApiResponse(BlogPostLikeApiResponse.BadRequest)
  @ApiResponse(BlogPostLikeApiResponse.PostNotFound)
  @ApiResponse(BlogPostLikeApiResponse.LikeOnPostExist)
  @ApiParam(ApiParamOption.PostId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Post(join('likes', POST_ID_PARAM))
  public async createLike(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<void> {
    const url = this.blogService.getLikesUrl(postId);
    const headers = makeHeaders(requestId, null, userId);

    await this.httpService.axiosRef.post(url, null, headers);
  }

  @ApiOperation(ApiOperationOption.Like.Delete)
  @ApiResponse(BlogPostLikeApiResponse.PostLikeDeleted)
  @ApiResponse(BlogPostLikeApiResponse.Unauthorized)
  @ApiResponse(BlogPostLikeApiResponse.BadRequest)
  @ApiResponse(BlogPostLikeApiResponse.PostNotFound)
  @ApiResponse(BlogPostLikeApiResponse.LikeNotFound)
  @ApiParam(ApiParamOption.PostId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @HttpCode(BlogPostLikeApiResponse.PostLikeDeleted.status)
  @Delete(join('likes', POST_ID_PARAM))
  public async deleteLike(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<void> {
    const url = this.blogService.getLikesUrl(postId);
    const headers = makeHeaders(requestId, null, userId);

    await this.httpService.axiosRef.delete(url, headers);
  }

  // Подписки
  @ApiOperation(ApiOperationOption.Subscription.Add)
  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionCreated)
  @ApiResponse(BlogSubscriptionApiResponse.Unauthorized)
  @ApiResponse(BlogSubscriptionApiResponse.BadRequest)
  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionExist)
  @ApiParam(ApiParamOption.UserId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Post(join(RouteAlias.Subscriptions, USER_ID_PARAM))
  public async create(
    @Param(ApiParamOption.UserId.name, MongoIdValidationPipe) authorUserId: string,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<void> {
    const url = this.blogService.getSubscriptionsUrl(authorUserId);
    const headers = makeHeaders(requestId, null, userId);

    await this.httpService.axiosRef.post(url, null, headers);
  }

  @ApiOperation(ApiOperationOption.Subscription.Delete)
  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionDeleted)
  @ApiResponse(BlogSubscriptionApiResponse.Unauthorized)
  @ApiResponse(BlogSubscriptionApiResponse.BadRequest)
  @ApiResponse(BlogSubscriptionApiResponse.SubscriptionNotFound)
  @ApiParam(ApiParamOption.UserId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @HttpCode(BlogSubscriptionApiResponse.SubscriptionDeleted.status)
  @Delete(join(RouteAlias.Subscriptions, USER_ID_PARAM))
  public async delete(
    @Param(ApiParamOption.UserId.name, MongoIdValidationPipe) authorUserId: string,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<void> {
    const url = this.blogService.getSubscriptionsUrl(authorUserId);
    const headers = makeHeaders(requestId, null, userId);

    await this.httpService.axiosRef.delete(url, headers);
  }
}
