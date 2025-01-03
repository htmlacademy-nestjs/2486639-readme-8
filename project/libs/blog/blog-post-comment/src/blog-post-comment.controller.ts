import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';

import { POST_ID_PARAM, BlogPostCommentApiResponse, PostIdApiParam } from './blog-post-comment.constant';
import { BlogPostCommentService } from './blog-post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { PostCommentRdo } from './rdo/post-comment.rdo';

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
  public async index(@Param(PostIdApiParam.name) postId: string) {
    const comments = await this.blogPostCommentService.getComments(postId);

    return fillDto(PostCommentRdo, comments.map((comment) => comment.toPOJO()));
  }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentCreated)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiParam(PostIdApiParam)
  @Post(POST_ID_PARAM)
  public async create(@Param(PostIdApiParam.name) postId: string, @Body() dto: CreatePostCommentDto) {
    const userId = '12321321321'; //! временно, необходимо определить пользователя
    const newComment = await this.blogPostCommentService.createComment(dto, postId, userId);

    return fillDto(PostCommentRdo, newComment.toPOJO());
  }

  @ApiResponse(BlogPostCommentApiResponse.PostCommentDeleted)
  @ApiResponse(BlogPostCommentApiResponse.Unauthorized)
  @ApiResponse(BlogPostCommentApiResponse.BadRequest)
  @ApiResponse(BlogPostCommentApiResponse.PostNotFound)
  @ApiParam(PostIdApiParam)
  @Delete(POST_ID_PARAM)
  public async delete(@Param(PostIdApiParam.name) postId: string) {
    const userId = '12321321321' //! временно

    await this.blogPostCommentService.deleteComment(postId, userId);
  }
}
