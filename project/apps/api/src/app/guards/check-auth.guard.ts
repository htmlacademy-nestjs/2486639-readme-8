import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { getAuthorizationHeader } from '@project/shared/helpers';
import { apiConfig } from '@project/api/config';
import { TokenPayloadRdo } from '@project/account/authentication';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = `${this.apiOptions.accountServiceUrl}/check`;
    const { data } = await this.httpService.axiosRef.post<TokenPayloadRdo>(url, {}, { headers: getAuthorizationHeader(request) });

    request['user'] = data; //! 'user' в константы? приходит в  UsersController -> checkToken(@Req() { user: payload }: RequestWithTokenPayload)

    return true;
  }
}
