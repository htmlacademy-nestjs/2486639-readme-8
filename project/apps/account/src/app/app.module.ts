import { Module } from '@nestjs/common';

import { AuthenticationModule } from '@project/account/authentication'
import { BlogUserModule } from '@project/account/blog-user'

@Module({
  imports: [
    AuthenticationModule,
    BlogUserModule
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
