
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { RouteAlias } from "@project/shared/core";

import { NewsLetterService } from "./news-letter.service";

@ApiTags(RouteAlias.RunNewsLetter)
@Controller(RouteAlias.RunNewsLetter)
export class NewsLetterController {
  constructor(
    private readonly newsLetterService: NewsLetterService
  ) { }

  //@ApiResponse(FileUploaderApiResponse.FileUploaded)
  @Get()
  public async sendNewsLetter(): Promise<void> {
    await this.newsLetterService.sendNewsLetter();
  }
}
