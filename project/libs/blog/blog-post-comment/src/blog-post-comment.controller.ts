import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';
import { GuidValidationPipe } from '@project/shared/pipes';

import { POST_ID_PARAM, BlogPostCommentApiResponse, PostIdApiParam } from './blog-post-comment.constant';
import { BlogPostCommentService } from './blog-post-comment.service';
import { BlogPostCommentQuery } from './blog-post-comment.query';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { PostCommentRdo } from './rdo/post-comment.rdo';
import { PostCommentWithPaginationRdo } from './rdo/post-comment-with-pagination.rdo';

@ApiTags('blog-post-comment')
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
  public async index(@Param(PostIdApiParam.name, GuidValidationPipe) postId: string, @Query() query: BlogPostCommentQuery) {
    // необходимо определить пользователя
    const currentUserId = '11223344';
    const postCommentsWithPagination = await this.blogPostCommentService.getComments(postId, currentUserId, query);
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
  public async create(@Param(PostIdApiParam.name, GuidValidationPipe) postId: string, @Body() dto: CreatePostCommentDto) {
    // необходимо определить пользователя
    const currentUserId = '11223344';
    const newComment = await this.blogPostCommentService.createComment(dto, postId, currentUserId);

    return fillDto(PostCommentRdo, newComment.toPOJO());
  }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentDeleted)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiResponse(BlogPostCommentApiResponse.CommentNotFound)
  @ApiParam(PostIdApiParam)
  @Delete(POST_ID_PARAM)
  public async delete(@Param(PostIdApiParam.name, GuidValidationPipe) postId: string) {
    // необходимо определить пользователя
    const currentUserId = '11223344'

    await this.blogPostCommentService.deleteComment(postId, currentUserId);
  }
}
