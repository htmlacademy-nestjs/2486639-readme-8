import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Inject, Param, ParseFilePipeBuilder, Post, Req,
  UploadedFile, UseFilters, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { BearerAuth, RequestWithTokenPayload, RouteAlias } from '@project/shared/core';
import { dtoToFormData, multerFileToFormData } from '@project/shared/helpers';
import { MongoIdValidationPipe } from '@project/shared/pipes';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';
import { apiConfig } from '@project/api/config';
import {
  AuthenticationApiResponse, AvatarOption, CreateUserDto, LoggedUserRdo, LoginUserDto,
  UserIdApiParam, UserRdo, UserTokenRdo, UserValidation
} from '@project/account/authentication';

import { CheckAuthGuard } from './guards/check-auth.guard';

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
  @ApiBearerAuth(BearerAuth.AccessToken) // для тестирования - анонимный пользователь может регистрироваться
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor(AvatarOption.KEY))
  @Post(RouteAlias.Register)
  public async register(
    @Body() dto: CreateUserDto,
    @Req() request: Request,
    @UploadedFile(
      //AvatarOption.KEY, ! avatarFile - undefined
      new ParseFilePipeBuilder()
        .addFileTypeValidator(UserValidation.AvatarFile.Type)
        .addMaxSizeValidator(UserValidation.AvatarFile.MaxSize)
        .build(UserValidation.AvatarFile.Build)) avatarFile?: Express.Multer.File) {
    const formData = new FormData();

    dtoToFormData(dto, formData);

    if (avatarFile) {
      multerFileToFormData(avatarFile, formData, AvatarOption.KEY);
    }

    const registerUrl = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Register}`;
    const { data: registerData } = await this.httpService.axiosRef.post<UserRdo>(
      registerUrl,
      formData,
      // headers: Authorization - т.к. только анонимный пользователь может регистрироваться
      { headers: { 'Authorization': request.headers['authorization'] } }
    );

    return registerData;
  }

  @ApiResponse(AuthenticationApiResponse.LoggedSuccess)
  @ApiResponse(AuthenticationApiResponse.LoggedError)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBody({ type: LoginUserDto, required: true })
  @Post(RouteAlias.Login)
  public async login(@Body() dto: LoginUserDto) {
    const url = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Login}`;
    const { data } = await this.httpService.axiosRef.post<LoggedUserRdo>(url, dto);

    return data;
  }

  @ApiResponse(AuthenticationApiResponse.LogoutSuccess)
  @ApiBearerAuth(BearerAuth.RefreshToken)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(RouteAlias.Logout)
  public async logout(@Req() request: Request) {
    const url = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Logout}`;

    await this.httpService.axiosRef.delete(url, { headers: { 'Authorization': request.headers['authorization'] } });
  }

  @ApiResponse(AuthenticationApiResponse.RefreshTokens)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth(BearerAuth.RefreshToken)
  @Post(RouteAlias.Refresh)
  public async refreshToken(@Req() request: Request) {
    const url = `${this.apiOptions.accountServiceUrl}/refresh`;
    const { data } = await this.httpService.axiosRef.post<UserTokenRdo>(
      url,
      null,
      { headers: { 'Authorization': request.headers['authorization'] } }
    );

    return data;
  }

  @ApiResponse(AuthenticationApiResponse.CheckSuccess)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @UseGuards(CheckAuthGuard)
  @Post(RouteAlias.Check)
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }

  @ApiResponse(AuthenticationApiResponse.UserFound)
  @ApiResponse(AuthenticationApiResponse.UserNotFound)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiParam(UserIdApiParam)
  @Get(`:${UserIdApiParam.name}`)
  public async show(@Param(UserIdApiParam.name, MongoIdValidationPipe) userId: string) {
    const url = `${this.apiOptions.accountServiceUrl}/${userId}`;
    const { data } = await this.httpService.axiosRef.get<UserRdo>(url);

    return data;
  }
}
