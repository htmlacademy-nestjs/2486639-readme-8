import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Inject, Param, Post, Req, UploadedFile,
  UseFilters, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { BearerAuth, RequestProperty, RequestWithTokenPayload, RouteAlias, XHeader } from '@project/shared/core';
import { dtoToFormData, getAuthorizationHeader, multerFileToFormData } from '@project/shared/helpers';
import { MongoIdValidationPipe } from '@project/shared/pipes';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';
import { apiConfig } from '@project/api/config';
import {
  AuthenticationApiResponse, AvatarOption, ChangePasswordDto, CreateUserDto, LoggedUserRdo, LoginUserDto,
  parseFilePipeBuilder, TokenPayloadRdo, UserIdApiParam, UserRdo, UserTokenRdo
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

  private getHeaders(request: Request, addAuthorizationHeader = false): { headers: { [XHeader.RequestId]: string, [XHeader.UserId]?: string } } {
    const headers = { [XHeader.RequestId]: request[RequestProperty.RequestId] };

    if (addAuthorizationHeader) {
      const authorizationHeader = getAuthorizationHeader(request);

      headers['Authorization'] = authorizationHeader.Authorization;
    }

    return { headers };
  }

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
    @UploadedFile(parseFilePipeBuilder) avatarFile?: Express.Multer.File
  ): Promise<UserRdo> {
    // headers: Authorization - т.к. только анонимный пользователь может регистрироваться
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
      this.getHeaders(request, true)
    );

    return registerData;
  }

  @ApiResponse(AuthenticationApiResponse.LoggedSuccess)
  @ApiResponse(AuthenticationApiResponse.LoggedError)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @Post(RouteAlias.Login)
  public async login(
    @Body() dto: LoginUserDto // для swagger
  ): Promise<LoggedUserRdo> {
    const url = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Login}`;
    const { data } = await this.httpService.axiosRef.post<LoggedUserRdo>(url, dto);

    return data;
  }

  @ApiResponse(AuthenticationApiResponse.LogoutSuccess)
  @ApiBearerAuth(BearerAuth.RefreshToken)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(RouteAlias.Logout)
  public async logout(@Req() request: Request): Promise<void> {
    const url = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Logout}`;

    await this.httpService.axiosRef.delete(url, { headers: getAuthorizationHeader(request) });
  }

  @ApiResponse(AuthenticationApiResponse.RefreshTokens)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.RefreshToken)
  @HttpCode(HttpStatus.OK)
  @Post(RouteAlias.Refresh)
  public async refreshToken(@Req() request: Request): Promise<UserTokenRdo> {
    const url = `${this.apiOptions.accountServiceUrl}/refresh`;
    const { data } = await this.httpService.axiosRef.post<UserTokenRdo>(url, null, { headers: getAuthorizationHeader(request) });

    return data;
  }

  @ApiResponse(AuthenticationApiResponse.CheckSuccess)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @HttpCode(HttpStatus.OK)
  @UseGuards(CheckAuthGuard)
  @Post(RouteAlias.Check)
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload): Promise<TokenPayloadRdo> {
    return payload;
  }

  @ApiResponse(AuthenticationApiResponse.ChangePasswordSuccess)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(RouteAlias.ChangePassword)
  public async changePassword(@Body() dto: ChangePasswordDto, @Req() request: Request): Promise<void> {
    const url = `${this.apiOptions.accountServiceUrl}/${RouteAlias.ChangePassword}`;

    await this.httpService.axiosRef.post(url, dto, { headers: getAuthorizationHeader(request) });
  }

  @ApiResponse(AuthenticationApiResponse.UserFound)
  @ApiResponse(AuthenticationApiResponse.UserNotFound)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiParam(UserIdApiParam)
  @Get(`:${UserIdApiParam.name}`)
  public async show(@Param(UserIdApiParam.name, MongoIdValidationPipe) userId: string): Promise<UserRdo> {
    const url = `${this.apiOptions.accountServiceUrl}/${userId}`;
    const { data } = await this.httpService.axiosRef.get<UserRdo>(url);

    return data;
  }
}
