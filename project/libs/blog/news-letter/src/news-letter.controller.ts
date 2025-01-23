
import { Controller, Get, HttpStatus, Req } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { RouteAlias, RequestWithRequestId } from "@project/shared/core";

import { NewsLetterService } from "./news-letter.service";

@ApiTags(RouteAlias.RunNewsLetter)
@Controller(RouteAlias.RunNewsLetter)
export class NewsLetterController {
  constructor(
    private readonly newsLetterService: NewsLetterService
  ) { }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'send news letter.'
  })
  @Get()
  public async sendNewsLetter(@Req() { requestId }: RequestWithRequestId): Promise<void> {
    await this.newsLetterService.sendNewsLetter(requestId);
  }
}
