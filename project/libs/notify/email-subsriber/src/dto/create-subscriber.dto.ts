import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubscriberDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public name: string;

  @IsOptional()
  public requestId?: string;
}
