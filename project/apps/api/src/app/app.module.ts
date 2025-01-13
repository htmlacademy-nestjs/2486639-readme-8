import { Module } from '@nestjs/common';

import { ApiConfigModule } from '@project/api/config';

@Module({
  imports: [ApiConfigModule],
  controllers: [],
  providers: []
})
export class AppModule { }
