import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { AuthUser } from '@project/shared/core';

import { ACCOUNTS_COLLECTION } from './blog-user.constant';

@Schema({
  collection: ACCOUNTS_COLLECTION,
  timestamps: true
})
export class BlogUserModel extends Document implements AuthUser {
  @Prop({ required: true, unique: true })
  public email: string;

  @Prop({ required: true })
  public name: string;

  @Prop()
  public avatarPath: string;

  @Prop({ required: true })
  public passwordHash: string;

  public createdAt: Date;
}

export const BlogUserSchema = SchemaFactory.createForClass(BlogUserModel);
