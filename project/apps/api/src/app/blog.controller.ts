import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Query, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiParamOption, BearerAuth, COMMENT_ID_PARAM, CommentWithUserAndPaginationRdo, CommentWithUserRdo, PageQuery, POST_ID_PARAM, RequestWithRequestId, RequestWithRequestIdAndUserId, RouteAlias } from '@project/shared/core';
import { fillDto, makeHeaders } from '@project/shared/helpers';
import { GuidValidationPipe } from '@project/shared/pipes';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';
import { apiConfig } from '@project/api/config';
import { BlogPostCommentApiResponse, CreatePostCommentDto } from '@project/blog/blog-post-comment';

import { CheckAuthGuard } from './guards/check-auth.guard';

@ApiTags('blog')
@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  // Комметарии
  @ApiResponse({ ...BlogPostCommentApiResponse.PostCommentsFound, type: CommentWithUserAndPaginationRdo })
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiParam(ApiParamOption.PostId)
  @Get(POST_ID_PARAM)
  public async index(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Query() { page }: PageQuery,
    @Req() { requestId }: RequestWithRequestId
  ): Promise<CommentWithUserAndPaginationRdo> {
    //!
    return fillDto(CommentWithUserAndPaginationRdo, {});
  }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentCreated)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiResponse(BlogPostCommentApiResponse.CommentOnPostExist)
  @ApiParam(ApiParamOption.PostId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Post(POST_ID_PARAM)
  public async create(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Body() dto: CreatePostCommentDto,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<CommentWithUserRdo> {
    //!
    return fillDto(CommentWithUserRdo, {});
  }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentDeleted)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiResponse(BlogPostCommentApiResponse.CommentNotFound)
  @ApiParam(ApiParamOption.PostId)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @HttpCode(BlogPostCommentApiResponse.PostCommentDeleted.status)
  @Delete(COMMENT_ID_PARAM)
  public async delete(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Req() { requestId, userId }: RequestWithRequestIdAndUserId
  ): Promise<void> {
    //!
  }

  // Лайки

  // Подписки
}
