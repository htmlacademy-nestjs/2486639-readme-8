import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, Req } from '@nestjs/common';
import { ApiHeaders, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';
import { GuidValidationPipe } from '@project/shared/pipes';
import { RequestWithUserId } from '@project/shared/core';
import { BlogRequestIdApiHeader, BlogUserIdApiHeader } from '@project/blog/blog-post';

import { POST_ID_PARAM, BlogPostCommentApiResponse, PostIdApiParam, CommentIdApiParam, COMMENT_ID_PARAM } from './blog-post-comment.constant';
import { BlogPostCommentService } from './blog-post-comment.service';
import { BlogPostCommentQuery } from './blog-post-comment.query';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { PostCommentRdo } from './rdo/post-comment.rdo';
import { PostCommentWithPaginationRdo } from './rdo/post-comment-with-pagination.rdo';

@ApiTags('blog-post-comment')
@ApiHeaders([BlogRequestIdApiHeader, BlogUserIdApiHeader]) // глобально вроде не добавить? и примеры почемуто не работают...
@Controller('post-comments')
export class BlogPostCommentController {
  constructor(
    private readonly blogPostCommentService: BlogPostCommentService
  ) { }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentsFound)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiParam(PostIdApiParam)
  @Get(POST_ID_PARAM)
  public async index(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Query() query: BlogPostCommentQuery,
    @Req() { userId }: RequestWithUserId
  ): Promise<PostCommentWithPaginationRdo> {
    const postCommentsWithPagination = await this.blogPostCommentService.getComments(postId, userId, query);
    const result = {
      ...postCommentsWithPagination,
      entities: postCommentsWithPagination.entities.map((comment) => comment.toPOJO())
    }

    return fillDto(PostCommentWithPaginationRdo, result);
  }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentCreated)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiResponse(BlogPostCommentApiResponse.CommentOnPostExist)
  @ApiParam(PostIdApiParam)
  @Post(POST_ID_PARAM)
  public async create(
    @Param(PostIdApiParam.name, GuidValidationPipe) postId: string,
    @Body() dto: CreatePostCommentDto,
    @Req() { userId }: RequestWithUserId
  ): Promise<PostCommentRdo> {
    const newComment = await this.blogPostCommentService.createComment(dto, postId, userId);

    return fillDto(PostCommentRdo, newComment.toPOJO());
  }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentDeleted)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiResponse(BlogPostCommentApiResponse.CommentNotFound)
  @ApiParam(CommentIdApiParam)
  @HttpCode(BlogPostCommentApiResponse.PostCommentDeleted.status)
  @Delete(COMMENT_ID_PARAM)
  public async delete(
    @Param(CommentIdApiParam.name, GuidValidationPipe) commentId: string,
    @Req() { userId }: RequestWithUserId
  ): Promise<void> {
    await this.blogPostCommentService.deleteComment(commentId, userId);
  }
}
