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
}

export const UserSchema = SchemaFactory.createForClass(User);

// 配置 MongoDB 验证规则
UserSchema.set('validateBeforeSave', true);

// 添加验证规则（可选，通常在数据库层面配置）
UserSchema.statics.getValidationRules = function() {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: ['_id', 'age', 'name'],
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
        }
      }
    }
  };
};