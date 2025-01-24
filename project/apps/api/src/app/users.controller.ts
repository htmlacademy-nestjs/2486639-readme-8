import {
  Body, Controller, Delete, Get, HttpCode, Inject, Param, Post,
  Req, UploadedFile, UseFilters, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiParamOption, BearerAuth, RequestWithRequestId, RequestWithRequestIdAndBearerAuth,
  RequestWithTokenPayload, RouteAlias, USER_ID_PARAM
} from '@project/shared/core';
import { dtoToFormData, makeHeaders, multerFileToFormData } from '@project/shared/helpers';
import { MongoIdValidationPipe } from '@project/shared/pipes';
import { AxiosExceptionFilter } from '@project/shared/exception-filters';
import { apiConfig } from '@project/api/config';
import {
  AuthenticationApiResponse, AvatarOption, ChangePasswordDto, CreateUserDto, LoggedUserRdo,
  LoginUserDto, parseFilePipeBuilder, TokenPayloadRdo, UserRdo, UserTokenRdo
} from '@project/account/authentication';
import { UserPostsCountRdo } from '@project/blog/blog-post';
import { UserSubscriptionsCountRdo } from '@project/blog/blog-subscription';

import { CheckAuthGuard } from './guards/check-auth.guard';
import { DetailUserRdo } from './rdo/detail-user.rdo';

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
    @Req() { requestId, bearerAuth }: RequestWithRequestIdAndBearerAuth,
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
      makeHeaders(requestId, bearerAuth)
    );

    return registerData;
  }

  @ApiResponse(AuthenticationApiResponse.LoggedSuccess)
  @ApiResponse(AuthenticationApiResponse.LoggedError)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @Post(RouteAlias.Login)
  public async login(@Body() dto: LoginUserDto, @Req() { requestId }: RequestWithRequestId): Promise<LoggedUserRdo> {
    const url = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Login}`;
    const { data } = await this.httpService.axiosRef.post<LoggedUserRdo>(url, dto, makeHeaders(requestId));

    return data;
  }

  @ApiResponse(AuthenticationApiResponse.LogoutSuccess)
  @ApiBearerAuth(BearerAuth.RefreshToken)
  @HttpCode(AuthenticationApiResponse.LogoutSuccess.status)
  @Delete(RouteAlias.Logout)
  public async logout(@Req() { requestId, bearerAuth }: RequestWithRequestIdAndBearerAuth): Promise<void> {
    const url = `${this.apiOptions.accountServiceUrl}/${RouteAlias.Logout}`;

    await this.httpService.axiosRef.delete(url, makeHeaders(requestId, bearerAuth));
  }

  @ApiResponse(AuthenticationApiResponse.RefreshTokens)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.RefreshToken)
  @HttpCode(AuthenticationApiResponse.RefreshTokens.status)
  @Post(RouteAlias.Refresh)
  public async refreshToken(@Req() { requestId, bearerAuth }: RequestWithRequestIdAndBearerAuth): Promise<UserTokenRdo> {
    const url = `${this.apiOptions.accountServiceUrl}/refresh`;
    const { data } = await this.httpService.axiosRef.post<UserTokenRdo>(url, null, makeHeaders(requestId, bearerAuth));

    return data;
  }

  @ApiResponse(AuthenticationApiResponse.CheckSuccess)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @HttpCode(AuthenticationApiResponse.CheckSuccess.status)
  @UseGuards(CheckAuthGuard)
  @Post(RouteAlias.Check)
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload): Promise<TokenPayloadRdo> {
    return payload;
  }

  @ApiResponse(AuthenticationApiResponse.ChangePasswordSuccess)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiResponse(AuthenticationApiResponse.Unauthorized)
  @ApiBearerAuth(BearerAuth.AccessToken)
  @HttpCode(AuthenticationApiResponse.ChangePasswordSuccess.status)
  @Post(RouteAlias.ChangePassword)
  public async changePassword(@Body() dto: ChangePasswordDto, @Req() { requestId, bearerAuth }: RequestWithRequestIdAndBearerAuth): Promise<void> {
    const url = `${this.apiOptions.accountServiceUrl}/${RouteAlias.ChangePassword}`;

    await this.httpService.axiosRef.post(url, dto, makeHeaders(requestId, bearerAuth));
  }

  @ApiResponse(AuthenticationApiResponse.UserFound)
  @ApiResponse(AuthenticationApiResponse.UserNotFound)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiParam(ApiParamOption.UserId)
  @Get(USER_ID_PARAM)
  public async show(
    @Param(ApiParamOption.UserId.name, MongoIdValidationPipe) userId: string,
    @Req() { requestId }: RequestWithRequestId): Promise<UserRdo> {
    const url = `${this.apiOptions.accountServiceUrl}/${userId}`;
    const { data } = await this.httpService.axiosRef.get<UserRdo>(url, makeHeaders(requestId));

    return data;
  }

  @ApiResponse({ ...AuthenticationApiResponse.UserFound, type: DetailUserRdo })
  @ApiResponse(AuthenticationApiResponse.UserNotFound)
  @ApiResponse(AuthenticationApiResponse.BadRequest)
  @ApiParam(ApiParamOption.UserId)
  @Get(`${USER_ID_PARAM}/detail`)
  public async getInfo(
    @Param(ApiParamOption.UserId.name, MongoIdValidationPipe) userId: string,
    @Req() { requestId }: RequestWithRequestId): Promise<DetailUserRdo> {
    const headers = makeHeaders(requestId);

    const getUserUrl = `${this.apiOptions.accountServiceUrl}/${userId}`;
    const { data: { registrationDate } } = await this.httpService.axiosRef.get<UserRdo>(getUserUrl, headers);

    const getPostsCountUrl = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Posts}/${RouteAlias.GetUserPostsCount}/${userId}`;
    const { data: { postsCount } } = await this.httpService.axiosRef.get<UserPostsCountRdo>(getPostsCountUrl, headers);

    const getSubscriptionsCountUrl = `${this.apiOptions.blogPostServiceUrl}/${RouteAlias.Subscriptions}/${RouteAlias.GetUserSubscriptionsCount}/${userId}`;
    const { data: { subscriptionsCount } } = await this.httpService.axiosRef.get<UserSubscriptionsCountRdo>(getSubscriptionsCountUrl, headers);

    return {
      userId,
      registrationDate,
      postsCount,
      subscriptionsCount
    };
  }
}
