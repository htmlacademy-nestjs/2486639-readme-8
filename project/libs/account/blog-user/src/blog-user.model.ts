import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { AuthUser } from '@project/shared/core';

@Schema({
  collection: 'accounts',
  timestamps: true
})
export class BlogUserModel extends Document implements AuthUser {
  @Prop({
    required: true,
    unique: true
  })
  public email: string;

  @Prop({
    required: true
  })
  public name: string;

  @Prop()
  public avatrPath: string;

  @Prop({
    required: true
  })
  public passwordHash: string;
}

export const BlogUserSchema = SchemaFactory.createForClass(BlogUserModel);
