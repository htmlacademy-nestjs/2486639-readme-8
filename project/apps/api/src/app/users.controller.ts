import {
  Body, Controller, Inject, ParseFilePipeBuilder, Post,
  Req, UploadedFile, UseFilters, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { BearerAuth, RequestWithTokenPayload, RouteAlias } from '@project/shared/core';
import { makePath } from '@project/shared/helpers';
import { apiConfig } from '@project/api/config';
import { AuthenticationApiResponse, CreateUserDto as AccountCreateUserDto, LoginUserDto, UserRdo } from '@project/account/authentication';
import { UploadedFileRdo } from '@project/file-storage/file-uploader';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Avatar, AvatarFileValidator } from './app.const';

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
  @ApiBearerAuth(BearerAuth.AccessToken)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor(Avatar.KEY))
  @Post(RouteAlias.Register)
  public async register(
    @Body() dto: CreateUserDto,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator(AvatarFileValidator.Type)
        .addMaxSizeValidator(AvatarFileValidator.MaxSize)
        .build(AvatarFileValidator.Build)) avatarFile?: Express.Multer.File) {
    const userDto: AccountCreateUserDto = { ...dto };

    console.log(dto);
    console.log(avatarFile);

    //return 'ok';

    if (avatarFile) {
      const fileFormData = new FormData();
      const fileBlob = new Blob([avatarFile.buffer], { type: avatarFile.mimetype });
      const originalFilename = Buffer.from(avatarFile.originalname, 'ascii').toString(); // коректное сохраниние исходного имени

      fileFormData.append('file', fileBlob, originalFilename);

      const fileUploadUrl = `${this.apiOptions.fileStorageServiceUrl}/${RouteAlias.Upload}`;
      const { data: fileUploadData } = await this.httpService.axiosRef.post<UploadedFileRdo>(fileUploadUrl, fileFormData);
      const { subDirectory, hashName } = fileUploadData;

      userDto.avatarPath = makePath(subDirectory, hashName);
    }

    const registerUrl = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Register}`;
    const { data: registerData } = await this.httpService.axiosRef.post<UserRdo>(
      registerUrl,
      userDto,
      // headers: Authorization - т.к. только анонимный пользователь может регистрироваться
      { headers: { 'Authorization': req.headers['authorization'] } }
    );

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
    const { data } = await this.httpService.axiosRef.post(
      url,
      null,
      { headers: { 'Authorization': req.headers['authorization'] } }
    );

    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post(RouteAlias.Check)
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }
}
