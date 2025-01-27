import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ApiConfigModule } from '@project/api/config';

import { UserService } from './user.service';
import { BlogService } from './blog.service';
import { UsersController } from './users.controller';
import { BlogPostController } from './blog-post.controller';
import { BlogController } from './blog.controller';

const HTTP_CLIENT_MAX_REDIRECTS = 5;
const HTTP_CLIENT_TIMEOUT = 3000;

@Module({
  imports: [
    ApiConfigModule,
    HttpModule.register({
      timeout: HTTP_CLIENT_TIMEOUT,
      maxRedirects: HTTP_CLIENT_MAX_REDIRECTS
    })
  ],
  controllers: [
    UsersController,
    BlogPostController,
    BlogController
  ],
  providers: [
    UserService,
    BlogService
  ]
})
export class AppModule { }
