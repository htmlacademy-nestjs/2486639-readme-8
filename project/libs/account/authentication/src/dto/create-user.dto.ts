import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';


import { UserValidation } from '../authentication.constant';
import { ApiPropertyOption } from '@project/shared/core';

export class CreateUserDto {
  @ApiProperty(ApiPropertyOption.User.Email)
  @IsEmail({})
  public email: string;

  @ApiProperty(ApiPropertyOption.User.Name)
  @IsString()
  @MinLength(UserValidation.Name.MinLength)
  @MaxLength(UserValidation.Name.MaxLength)
  public name: string;

  @ApiProperty(ApiPropertyOption.User.Password)
  @IsString()
  @MinLength(UserValidation.Password.MinLength)
  @MaxLength(UserValidation.Password.MaxLength)
  public password: string;

  @ApiProperty(ApiPropertyOption.User.AvatarFile)
  @IsOptional()
  public avatarFile?: string; // для описания Swagger, фактически будет в @UploadedFile... avatarFile?: Express.Multer.File
}
