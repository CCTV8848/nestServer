import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Article extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  author: string;

  @Prop({ default: Date.now })
  publishTime: Date;

  @Prop({ default: 0 })
  readCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop([{ content: String, replyTime: Date }])
  replies: { content: string; replyTime: Date }[];

  @Prop([String])
  tags: string[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);