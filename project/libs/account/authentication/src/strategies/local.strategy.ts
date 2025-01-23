import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { getValidationErrorString } from '@project/shared/helpers';
import { BlogUserEntity } from '@project/account/blog-user';

import { AuthenticationService } from '../authentication.service';
import { LoginUserDto } from '../dto/login-user.dto';

const USERNAME_FIELD_NAME = 'email';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthenticationService) {
    super({ usernameField: USERNAME_FIELD_NAME });
  }

  public async validate(email: string, password: string): Promise<BlogUserEntity> {
    const dto = { email, password };
    const error = validateSync(plainToClass(LoginUserDto, dto));

    if (error.length) {
      throw new BadRequestException(getValidationErrorString(error));
    }

    const userEntity = await this.authService.verifyUser({ email, password });

    return userEntity;
  }
}
