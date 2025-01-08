import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Subscriber } from '@project/shared/core';

@Schema({
  collection: 'email-subscribers',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class EmailSubscriberModel extends Document implements Subscriber {
  public id?: string;

  @Prop({
    required: true,
  })
  public email: string;

  @Prop({
    required: true
  })
  public name: string;
}

export const EmailSubscriberSchema = SchemaFactory.createForClass(EmailSubscriberModel);

//! если не понадобится, то удалить
/*
EmailSubscriberSchema.virtual('id').get(function () {
  return this._id.toString();
});
*/
