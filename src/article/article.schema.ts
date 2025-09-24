import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

// 定义二级回复的接口
interface ReplyTo {}

// 定义回复的接口
interface Reply {
  _id: mongoose.Schema.Types.ObjectId;
  content: string;
  replyTime: Date;
  likeCount: number;
  // 回复的用户ID
  userId: string;
  // 针对一级回复的回复，这里存储回复的ID
  replyTo?: mongoose.Schema.Types.ObjectId;
  // 二级回复数组
  replies?: Reply[];
}

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

  // 修改回复结构，支持嵌套回复
  @Prop([{
    content: { type: String, required: true },
    replyTime: { type: Date, default: Date.now },
    likeCount: { type: Number, default: 0 },
    userId: { type: String, required: true },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    replies: [{
      content: { type: String, required: true },
      replyTime: { type: Date, default: Date.now },
      likeCount: { type: Number, default: 0 },
      userId: { type: String, required: true },
      replyTo: { type: mongoose.Schema.Types.ObjectId }
    }]
  }])
  replies: Reply[];

  @Prop([String])
  tags: string[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);