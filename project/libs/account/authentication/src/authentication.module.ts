import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { getJwtOptions } from '@project/account/config';
import { BlogUserModule } from '@project/account/blog-user';
import { NotifyModule } from '@project/account/notify';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { LocalStrategy } from './strategies/local.strategy';

const JwtModuleOption = {
  inject: [ConfigService],
  useFactory: getJwtOptions
}

@Module({
  imports: [
    BlogUserModule,
    JwtModule.registerAsync(JwtModuleOption),
    NotifyModule
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtAccessStrategy,
    LocalStrategy
  ]
})
export class AuthenticationModule { }
