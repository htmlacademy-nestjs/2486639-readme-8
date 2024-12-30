import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { /*ApiParam, ApiResponse,*/ ApiTags } from '@nestjs/swagger';

import { fillDto } from '@project/shared/helpers';

//import { PostCommentIdApiParam, BlogPostCommentApiResponse } from './blog-post-comment.constant';
import { BlogPostCommentService } from './blog-post-comment.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { PostCommentRdo } from './rdo/post-comment.rdo';

@ApiTags('blog-post-comment')
@Controller('comment')
export class BlogPostCommentController {
  constructor(
    private readonly blogPostCommentService: BlogPostCommentService
  ) { }

  //@ApiResponse(BlogPostApiResponse.PostCreated)
  //@ApiResponse(BlogPostApiResponse.Unauthorized)
  @Post(':postId')
  public async create(@Param(/*//!! */'postId') postId: string, @Body() dto: CreatePostCommentDto) {
    const userId = '12321321321'; //! определить пользователя
    const newComment = await this.blogPostCommentService.create(dto, postId, userId);

    return fillDto(PostCommentRdo, newComment.toPOJO());
  }

  //@ApiResponse(BlogPostApiResponse.PostFound)
  //@ApiResponse(BlogPostApiResponse.PostNotFound)
  //@ApiParam(PostIdApiParam)
  //@Get(`:${PostIdApiParam.name}`)
  @Get(':postId')
  public async index(@Param(/*PostIdApiParam.name*/'postId') postId: string) {
    console.log(postId); //! тест
    const comments = await this.blogPostCommentService.findByPostId(postId);

    return fillDto(PostCommentRdo, comments.map((comment) => comment.toPOJO()));
  }

  //  @ApiResponse(BlogPostApiResponse.PostDeleted)
  //  @ApiResponse(BlogPostApiResponse.Unauthorized)
  //  @ApiResponse(BlogPostApiResponse.PostNotFound)
  //  @ApiResponse(BlogPostApiResponse.NotAllow)
  //  @ApiParam(PostIdApiParam)
  //  @Delete(`:${PostIdApiParam.name}`)
  @Delete(':postId')
  public async delete(@Param(/*PostIdApiParam.name*/) postId: string) {
    const userId = '123132131' //! временно

    await this.blogPostCommentService.delete(postId, userId);
  }
}
