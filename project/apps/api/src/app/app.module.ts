import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ApiConfigModule } from '@project/api/config';

import { UsersController } from './users.controller';
import { CheckAuthGuard } from './guards/check-auth.guard';

export const HTTP_CLIENT_MAX_REDIRECTS = 5;
export const HTTP_CLIENT_TIMEOUT = 3000;

@Module({
  imports: [
    ApiConfigModule,
    HttpModule.register({
      timeout: HTTP_CLIENT_TIMEOUT,
      maxRedirects: HTTP_CLIENT_MAX_REDIRECTS
    })
  ],
  controllers: [UsersController],
  providers: [CheckAuthGuard]
})
export class AppModule { }
