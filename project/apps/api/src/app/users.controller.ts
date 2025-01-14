import {
  Body, Controller, HttpStatus, Inject, ParseFilePipeBuilder,
  Post, Req, UploadedFile, UseFilters, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { RequestWithTokenPayload, RouteAlias } from '@project/shared/core';
import { makePath } from '@project/shared/helpers';
import { apiConfig } from '@project/api/config';
import { AuthenticationApiResponse, LoginUserDto } from '@project/account/authentication';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { CreateUserWithAvatarFileDto } from './dto/create-user-with-avatar-file.dto';

@ApiTags('users')
@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  @ApiResponse(AuthenticationApiResponse.UserCreated)
  @ApiResponse(AuthenticationApiResponse.UserExist)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.NotAllow)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatarFile'))
  @Post(RouteAlias.Register)
  public async register(
    @Body() dto: CreateUserWithAvatarFileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/jpeg|image/png' })
        .addMaxSizeValidator({ maxSize: 500 * 1024 })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })) avatarFile: Express.Multer.File) {

    const fileFormData = new FormData();
    const fileBlob = new Blob([avatarFile.buffer], { type: avatarFile.mimetype });
    const originalFilename = Buffer.from(avatarFile.originalname, 'ascii').toString(); // коректное сохраниние исходного имени

    fileFormData.append('file', fileBlob, originalFilename);

    const fileUploadUrl = `${this.apiOptions.fileStorageServiceUrl}/${RouteAlias.Upload}`;
    const { data: fileUploadData } = await this.httpService.axiosRef.post(fileUploadUrl, fileFormData);
    //! временно //! any
    const { subDirectory, hashName } = fileUploadData;

    //! временно //! типизировать!
    dto['avatarPath'] = makePath(subDirectory, hashName);

    const registerUrl = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Register}`;
    const { data: registerData } = await this.httpService.axiosRef.post(registerUrl, dto);

    return registerData;
  }

  @Post(RouteAlias.Login)
  public async login(@Body() dto: LoginUserDto) {
    const url = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Login}`;
    const { data } = await this.httpService.axiosRef.post(url, dto);

    return data;
  }

  @Post(RouteAlias.Refresh)
  public async refreshToken(@Req() req: Request) {
    const url = `${this.apiOptions.accountServiceUrl}/refresh`;
    const { data } = await this.httpService.axiosRef.post(url, null, {
      headers: { 'Authorization': req.headers['authorization'] }
    });

    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post(RouteAlias.Check)
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }
}
