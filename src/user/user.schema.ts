import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop()
  sex: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) // select: false 表示查询时默认不返回密码字段
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 配置 MongoDB 验证规则
UserSchema.set('validateBeforeSave', true);

// 添加验证规则（可选，通常在数据库层面配置）
UserSchema.statics.getValidationRules = function() {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: ['_id', 'age', 'name', 'email', 'password'],
      properties: {
        _id: {
          bsonType: 'objectId'
        },
        age: {
          bsonType: 'long'
        },
        name: {
          bsonType: 'string'
        },
        sex: {
          bsonType: 'string'
        },
        email: {
          bsonType: 'string'
        },
        password: {
          bsonType: 'string'
        }
      }
    }
  };
};