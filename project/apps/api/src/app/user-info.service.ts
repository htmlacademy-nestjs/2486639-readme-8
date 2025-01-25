import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { apiConfig } from '@project/api/config';
import { UserRdo } from '@project/shared/core';

import { makeHeaders } from '@project/shared/helpers';

@Injectable()
export class UserInfoService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiConfig.KEY)
    private readonly apiOptions: ConfigType<typeof apiConfig>
  ) { }

  public async getUserInfo(id: string, requestId: string): Promise<UserRdo> {
    const url = `${this.apiOptions.accountServiceUrl}/${id}`;
    const { data } = await this.httpService.axiosRef.get<UserRdo>(url, makeHeaders(requestId));

    return data;
  }
}
