import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // 注意这里需要使用 select('+password') 来查询密码字段
    const user = await this.userService.findOneByEmail(email);
    
    // 同时支持明文密码和bcrypt加密的密码
    const isPasswordValid = 
      user.password === password || // 直接比较明文密码
      await bcrypt.compare(password, user.password); // 尝试bcrypt比较
    
    if (user && isPasswordValid) {
      // 不返回密码字段，使用toJSON()方法
      const { password, ...result } = user.toJSON();
      return result;
    }
    
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user._id,
      email: user.email
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    };
  }
}