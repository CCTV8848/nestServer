import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: Partial<User>): Promise<User> {
    // 加密密码
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  // 添加通过邮箱查找用户的方法，包含密码字段
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).select('+password').exec();
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    return user;
  }

  // 添加通过ID查找用户的方法，不包含密码
  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async findByName(name: string): Promise<User[]> {
    return this.userModel.find({ name: new RegExp(name, 'i') }).exec();
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    // 如果更新密码，需要重新加密
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const user = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }
}