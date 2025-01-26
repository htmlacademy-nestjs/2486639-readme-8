import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, Req } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';
import { GuidValidationPipe } from '@project/shared/pipes';
import {
  ApiHeaderOption, ApiParamOption, CommentWithUserIdRdo, RequestWithUserId, PageQuery,
  CommentWithUserIdAndPaginationRdo, POST_ID_PARAM, RouteAlias, COMMENT_ID_PARAM
} from '@project/shared/core';

import { BlogPostCommentApiResponse } from './blog-post-comment.constant';
import { BlogPostCommentService } from './blog-post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';

@ApiTags('blog-post-comment')
@ApiHeader(ApiHeaderOption.UserId)
@Controller(RouteAlias.PostComments)
export class BlogPostCommentController {
  constructor(
    private readonly blogPostCommentService: BlogPostCommentService
  ) { }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentsFound)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiParam(ApiParamOption.PostId)
  @Get(POST_ID_PARAM)
  public async index(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Query() { page }: PageQuery,
    @Req() { userId }: RequestWithUserId
  ): Promise<CommentWithUserIdAndPaginationRdo> {
    const postCommentsWithPagination = await this.blogPostCommentService.getComments(postId, userId, page);
    const result = {
      ...postCommentsWithPagination,
      entities: postCommentsWithPagination.entities.map((comment) => comment.toPOJO())
    }

    return fillDto(CommentWithUserIdAndPaginationRdo, result);
  }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentCreated)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiResponse(BlogPostCommentApiResponse.CommentOnPostExist)
  @ApiParam(ApiParamOption.PostId)
  @Post(POST_ID_PARAM)
  public async create(
    @Param(ApiParamOption.PostId.name, GuidValidationPipe) postId: string,
    @Body() dto: CreatePostCommentDto,
    @Req() { userId }: RequestWithUserId
  ): Promise<CommentWithUserIdRdo> {
    const newComment = await this.blogPostCommentService.createComment(dto, postId, userId);

    return fillDto(CommentWithUserIdRdo, newComment.toPOJO());
  }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentDeleted)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiResponse(BlogPostCommentApiResponse.CommentNotFound)
  @ApiParam(ApiParamOption.CommentId)
  @HttpCode(BlogPostCommentApiResponse.PostCommentDeleted.status)
  @Delete(COMMENT_ID_PARAM)
  public async delete(
    @Param(ApiParamOption.CommentId.name, GuidValidationPipe) commentId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogPostCommentService.deleteComment(commentId, userId);
  }
}
