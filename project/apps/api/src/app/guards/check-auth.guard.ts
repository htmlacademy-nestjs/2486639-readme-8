import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { apiConfig } from '@project/api/config';

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
    const { data } = await this.httpService.axiosRef.post(url, {}, {
      headers: {
        'Authorization': request.headers['authorization']
      }
    })

    request['user'] = data; //! 'user'

    return true;
  }
}
