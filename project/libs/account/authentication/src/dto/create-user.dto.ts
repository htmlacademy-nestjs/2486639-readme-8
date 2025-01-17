import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { UserApiProperty } from '../authentication.constant.property';
import { UserValidation } from '../authentication.constant';

export class CreateUserDto {
  @ApiProperty(UserApiProperty.Email)
  @IsEmail({})
  public email: string;

  @ApiProperty(UserApiProperty.Name)
  @IsString()
  @MinLength(UserValidation.Name.MinLength)
  @MaxLength(UserValidation.Name.MaxLength)
  public name: string;

  @ApiProperty(UserApiProperty.Password)
  @IsString()
  @MinLength(UserValidation.Password.MinLength)
  @MaxLength(UserValidation.Password.MaxLength)
  public password: string;

  @ApiProperty(UserApiProperty.AvatarFile)
  @IsOptional()
  public avatarFile?: string; // для описания Swagger, фактически будет в @UploadedFile... avatarFile?: Express.Multer.File
}
