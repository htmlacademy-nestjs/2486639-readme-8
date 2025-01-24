import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { NewsLetter } from '@project/shared/core';

@Schema({
  collection: 'news-letters',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class NewsLetterModel extends Document implements NewsLetter {
  @Prop({ required: true })
  public payload: string;

  public createdAt: Date;

  public updatedAt: Date;
}

export const NewsLetterSchema = SchemaFactory.createForClass(NewsLetterModel);
